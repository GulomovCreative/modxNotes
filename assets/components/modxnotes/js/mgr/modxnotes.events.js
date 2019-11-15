modxNotes.Events = {
    add: function() {                       // Пресоздание элемента 
        var column = modxNotes.Utils.createElement('column', null, false);
        var item = modxNotes.Utils.createElement('item');
        column.append(item);
        
        modxNotes.elements.grid.insertBefore(column, this.parentNode);
        this.parentNode.remove();
    },
    create: function() {
        var form = this.closest('form');
        if (this.value != '' && this.classList.contains('error')) {
            this.classList.remove('error');
        }
        this.onblur = function() {
            modxNotes.savingTimeout = setTimeout(function() {
                modxNotes.Ajax('mgr/item/create', modxNotes.Utils.serialize(form), form);
            }, 200);
        };
        this.removeAttribute('title');
    },
    changeColor: function() {
        var form = this.closest('form');
        var color = form.querySelector('[name=color]');
        var choose = this.dataset.color;

        if (color && !this.classList.contains('modxnote-color--active')) {
            color.value = choose;
            modxNotes.Ajax('mgr/item/changecolor', modxNotes.Utils.serialize(form), form);
        }
    },
    changeStatus: function() {
        var form = this.closest('form');
        var active = form.querySelector('[name=active]');
        var status = !!!active.value;
        modxNotes.Ajax(active.value == 1 ? 'mgr/item/disable' : 'mgr/item/enable', modxNotes.Utils.serialize(form), form);
        active.value = active.value == 1 ? 0 : 1;
    },
    update: function() {
        var form = this.closest('form');
        if (this.value != '' && this.classList.contains('error')) {
            this.classList.remove('error');
        }
        clearTimeout(modxNotes.typingTimeout);
        modxNotes.typingTimeout = setTimeout(function() {
            modxNotes.Ajax('mgr/item/update', modxNotes.Utils.serialize(form), form);
        }, 1000);
        this.removeAttribute('title');
    },
    remove: function() {
        var form = this.closest('form');
        var id = form.querySelector('[name=id]').value;
        if (id) {
            if (confirm(_('modxnotes_item_remove_confirm'))) {
                modxNotes.Ajax('mgr/item/remove', modxNotes.Utils.serialize(form), form);
            }
        } else {
            clearInterval(modxNotes.savingTimeout);
            form.parentNode.remove();
            var column = modxNotes.Utils.createElement('column');
            column.append(modxNotes.Utils.createElement('add'));
            modxNotes.elements.grid.append(column);
        }
    },
    blur: function(e) {
        var target = e.relatedTarget;
        if (target && !target.classList.contains('modxnote__name') || target && !target.classList.contains('modxnote__description')) {
            return;
        }
        modxNotes.elements.grid.classList.remove('modxnote-grid--updating');
        modxNotes.elements.grid.querySelectorAll('.modxnote--updating').forEach(function(el) {
            el.classList.remove('modxnote--updating');
        });
    },
    focus: function() {
        modxNotes.elements.grid.classList.add('modxnote-grid--updating');
        modxNotes.elements.grid.querySelectorAll('.modxnote--updating').forEach(function(el) {
            el.classList.remove('modxnote--updating');
        });

        // this.children[0].focus();

        var it = this.closest('.modxnote');
        it.classList.add('modxnote--updating');
    },
    DD: {                                   // Drag and Drop
        handleDragStart: function (e) {
            if (!e.target.classList.contains('modxnote-column--locked') && !modxNotes.elements.grid.classList.contains('modxnote-grid--updating')) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
                modxNotes.dragEl = this;
                this.classList.add('modxnote--moving');
            } else {
                e.preventDefault();
            }
        },
        handleDragOver: function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            return false;
        },
        handleDrop: function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }

            var target = this.querySelector('[name=id]').value;
            var source = modxNotes.dragEl.querySelector('[name=id]').value;

            modxNotes.Ajax('mgr/item/sort', {
                target: target,
                source: source,
            });

            return false;
        },
        handleDragEnd: function (e) {
            modxNotes.dragEl = null;
        },
    }
}