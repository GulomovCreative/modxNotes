modNotes.Events = {
    add: function() {                       // Пресоздание элемента 
        var column = modNotes.Utils.createElement('column', null, false);
        var item = modNotes.Utils.createElement('item');
        column.append(item);
        
        modNotes.elements.grid.insertBefore(column, this.parentNode);
        this.parentNode.remove();
    },
    create: function() {
        var form = this.closest('form');
        if (this.value != '' && this.classList.contains('error')) {
            this.classList.remove('error');
        }
        this.onblur = function() {
            modNotes.savingTimeout = setTimeout(function() {
                modNotes.Ajax('mgr/item/create', modNotes.Utils.serialize(form), form);
            }, 200);
        };
        this.removeAttribute('title');
    },
    changeColor: function() {
        var form = this.closest('form');
        var color = form.querySelector('[name=color]');
        var choose = this.dataset.color;

        if (color && !this.classList.contains('modnote-color--active')) {
            color.value = choose;
            modNotes.Ajax('mgr/item/changecolor', modNotes.Utils.serialize(form), form);
        }
    },
    changeStatus: function() {
        var form = this.closest('form');
        var active = form.querySelector('[name=active]');
        var status = !!!active.value;
        modNotes.Ajax(active.value == 1 ? 'mgr/item/disable' : 'mgr/item/enable', modNotes.Utils.serialize(form), form);
        active.value = active.value == 1 ? 0 : 1;
    },
    update: function() {
        var form = this.closest('form');
        if (this.value != '' && this.classList.contains('error')) {
            this.classList.remove('error');
        }
        clearTimeout(modNotes.typingTimeout);
        modNotes.typingTimeout = setTimeout(function() {
            modNotes.Ajax('mgr/item/update', modNotes.Utils.serialize(form), form);
        }, 1000);
        this.removeAttribute('title');
    },
    remove: function() {
        var form = this.closest('form');
        var id = form.querySelector('[name=id]').value;
        if (id) {
            if (confirm(_('modnotes_item_remove_confirm'))) {
                modNotes.Ajax('mgr/item/remove', modNotes.Utils.serialize(form), form);
            }
        } else {
            clearInterval(modNotes.savingTimeout);
            form.parentNode.remove();
            var column = modNotes.Utils.createElement('column');
            column.append(modNotes.Utils.createElement('add'));
            modNotes.elements.grid.append(column);
        }
    },
    blur: function(e) {
        var target = e.relatedTarget;
        if (target && !target.classList.contains('modnote__name') || target && !target.classList.contains('modnote__description')) {
            return;
        }
        modNotes.elements.grid.classList.remove('modnote-grid--updating');
        modNotes.elements.grid.querySelectorAll('.modnote--updating').forEach(function(el) {
            el.classList.remove('modnote--updating');
        });
    },
    focus: function() {
        modNotes.elements.grid.classList.add('modnote-grid--updating');
        modNotes.elements.grid.querySelectorAll('.modnote--updating').forEach(function(el) {
            el.classList.remove('modnote--updating');
        });

        // this.children[0].focus();

        var it = this.closest('.modnote');
        it.classList.add('modnote--updating');
    },
    DD: {                                   // Drag and Drop
        handleDragStart: function (e) {
            if (!e.target.classList.contains('modnote-column--locked') && !modNotes.elements.grid.classList.contains('modnote-grid--updating')) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
                modNotes.dragEl = this;
                this.classList.add('modnote--moving');
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
            var source = modNotes.dragEl.querySelector('[name=id]').value;

            modNotes.Ajax('mgr/item/sort', {
                target: target,
                source: source,
            });

            return false;
        },
        handleDragEnd: function (e) {
            modNotes.dragEl = null;
        },
    }
}