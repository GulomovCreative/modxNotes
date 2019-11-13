modNotes.Utils = {
    createNode: function (type, attributes, innerText) {
        var el = document.createElement(type);
        for (key in attributes) {
            el.setAttribute(key, attributes[key]);
        }
        if (innerText) { el.innerText = innerText; }

        return el;
    },
    createElement: function(element, data, drag = true) {       // Метод создания более сложных элементов
        switch (element) {
            case 'column':
                var el = this.createNode('div', {
                    class: 'modnote-column',
                });
                if (drag) {
                    var dragEl = null;
                    el.setAttribute('draggable', 'true');
                    el.addEventListener('dragstart', modNotes.Events.DD.handleDragStart, false);
                    el.addEventListener('dragover', modNotes.Events.DD.handleDragOver, false);
                    el.addEventListener('drop', modNotes.Events.DD.handleDrop, false);
                    el.addEventListener('dragend', modNotes.Events.DD.handleDragEnd, false);
                } else {
                    el.classList.add('modnote-column--locked');
                }
                
                break;
            case 'name':
                var el = this.createNode('div', {
                    class: 'modnote__input',
                });
                var name = this.createNode('input', {
                    type: 'text',
                    class: 'modnote__name',
                    name: 'name',
                    placeholder: _('modnotes_item_name_placeholder'),
                    value: data ? data.name : '',
                });
                name.addEventListener('keyup', data ? modNotes.Events.update : modNotes.Events.create);
                name.addEventListener('blur', modNotes.Events.blur);
                el.addEventListener('click', modNotes.Events.focus);
                el.append(name);

                break;
            case 'description':
                var el = this.createNode('div', {
                    class: 'modnote__textarea',
                });
                var description = this.createNode('textarea', {
                    class: 'modnote__description',
                    name: 'description',
                    placeholder: _('modnotes_item_description_placeholder'),
                });
                description.innerText = data ? data.description : '';
                description.addEventListener('keyup', data ? modNotes.Events.update : modNotes.Events.create);
                description.addEventListener('blur', modNotes.Events.blur);
                el.addEventListener('click', modNotes.Events.focus);
                el.append(description);

                break;
            case 'item':
                var el = this.createNode('form', {
                    class: 'modnote',
                });
                el.onsubmit = function(e) {
                    e.preventDefault();
                    return false;
                }

                var id = this.createNode('input', {
                    type: 'hidden',
                    name: 'id',
                    value: data ? data.id : '',
                });

                var remove = this.createNode('span', {
                    class: 'modnote__remove',
                    title: _('modnotes_item_remove'),
                });
                remove.innerHTML = '<i class="icon icon-close"></i>';
                remove.addEventListener('click', modNotes.Events.remove);

                var color = this.createNode('input', {
                    type: 'hidden',
                    name: 'color',
                    value: data ? data.color : '',
                });

                el.append(id, this.createElement('name', data), this.createElement('description', data), remove, color);
                el.addEventListener('click', modNotes.Events.click);

                if (data) {
                    var active = this.createNode('input', {
                        type: 'hidden',
                        name: 'active',
                        value: data.active ? 1 : 0,
                    });

                    if (!data.active) {
                        el.classList.add('modnote--disabled');
                    }

                    if (data.color) {
                        el.classList.add('modnote--' + data.color);
                    }

                    var toolbar = this.createElement('toolbar', data);
                    el.append(active, toolbar);
                }

                break;
            case 'add':
                var el = this.createNode('div', {
                    class: 'modnote__add',
                    title: _('modnotes_item_create'),
                });
                el.innerText = '+';
                el.addEventListener('click', modNotes.Events.add);

                break;
            case 'toolbar':
                var el = this.createNode('div', {
                    class: 'modnote__toolbar',
                });

                if (data) {
                    var colors = this.createNode('ul', {
                        class: 'modnote-colors',
                    });
    
                    for (var key in modNotes.colors) {
                        var tmp = this.createNode('li', {
                            class: 'modnote-color modnote--' + key,
                            title: _('modnotes_item_color_' + key),
                        });
                        var color = data.color || 'white';
                        if (color == key) {
                            tmp.classList.add('modnote-color--active');
                        }
                        tmp.dataset.color = modNotes.colors[key] ? key : '';
                        tmp.addEventListener('click', modNotes.Events.changeColor);
    
                        colors.append(tmp);
                    }

                    var activeClass = data.active ? ' active' : '';
                    var active = this.createNode('span', {
                        class: 'modnote__active' + activeClass,
                        title: data.active ? _('modnotes_item_disable') : _('modnotes_item_enable'),
                    });
                    active.addEventListener('click', modNotes.Events.changeStatus);

                    el.append(active, colors);
                }

                break;
        }

        return el;
    },
    serialize: function (form) {
        var serialized = {};
        for (var i = 0; i < form.elements.length; i++) {
            var field = form.elements[i];
            if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;
            if (field.type === 'select-multiple') {
                for (var n = 0; n < field.options.length; n++) {
                    if (!field.options[n].selected) continue;
                    serialized[field.name] = field.options[n].value;
                }
            }
            else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                serialized[field.name] = field.value;
            }
        }
        return serialized;
    }
}