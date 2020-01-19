modxNotes.Utils = {
    createNode: function (type, attributes, innerText) {
        var el = document.createElement(type);
        for (key in attributes) {
            el.setAttribute(key, attributes[key]);
        }
        if (innerText) {
            el.innerText = innerText;
        }

        return el;
    },
    createElement: function (element, data, drag = true) {       // Метод создания более сложных элементов
        switch (element) {
            case 'column':
                var el = this.createNode('div', {
                    class: 'modxnote-column',
                });
                if (drag) {
                    var dragEl = null;
                    el.setAttribute('draggable', 'true');
                    el.addEventListener('dragstart', modxNotes.Events.DD.handleDragStart, false);
                    el.addEventListener('dragover', modxNotes.Events.DD.handleDragOver, false);
                    el.addEventListener('drop', modxNotes.Events.DD.handleDrop, false);
                    el.addEventListener('dragend', modxNotes.Events.DD.handleDragEnd, false);
                } else {
                    el.classList.add('modxnote-column--locked');
                }

                break;
            case 'name':
                var el = this.createNode('div', {
                    class: 'modxnote__input',
                    title: data ? data.name : '',
                });
                var name = this.createNode('input', {
                    type: 'text',
                    class: 'modxnote__name',
                    name: 'name',
                    placeholder: _('modxnotes_item_name_placeholder'),
                    value: data ? data.name : '',
                });
                name.addEventListener('keyup', data ? modxNotes.Events.update : modxNotes.Events.create);
                name.addEventListener('blur', modxNotes.Events.blur);
                el.addEventListener('click', modxNotes.Events.focus);
                el.append(name);

                break;
            case 'description':
                var el = this.createNode('div', {
                    class: 'modxnote__textarea',
                });
                var description = this.createNode('textarea', {
                    class: 'modxnote__description',
                    name: 'description',
                    placeholder: _('modxnotes_item_description_placeholder'),
                });
                description.innerText = data ? data.description : '';
                description.addEventListener('keyup', data ? modxNotes.Events.update : modxNotes.Events.create);
                description.addEventListener('blur', modxNotes.Events.blur);
                el.addEventListener('click', modxNotes.Events.focus);
                el.append(description);

                break;
            case 'item':
                var el = this.createNode('form', {
                    class: 'modxnote',
                });
                el.onsubmit = function (e) {
                    e.preventDefault();
                    return false;
                }

                var id = this.createNode('input', {
                    type: 'hidden',
                    name: 'id',
                    value: data ? data.id : '',
                });

                var remove = this.createNode('span', {
                    class: 'modxnote__remove',
                    title: _('modxnotes_item_remove'),
                });
                remove.innerHTML = '<i class="icon icon-close"></i>';
                remove.addEventListener('click', modxNotes.Events.remove);

                var color = this.createNode('input', {
                    type: 'hidden',
                    name: 'color',
                    value: data ? data.color : '',
                });

                el.append(id, this.createElement('name', data), this.createElement('description', data), remove, color);
                el.addEventListener('click', modxNotes.Events.click);

                if (data) {
                    var active = this.createNode('input', {
                        type: 'hidden',
                        name: 'active',
                        value: data.active ? 1 : 0,
                    });

                    if (!data.active) {
                        el.classList.add('modxnote--disabled');
                    }

                    if (data.color) {
                        el.classList.add('modxnote--' + data.color);
                    }

                    var toolbar = this.createElement('toolbar', data);
                    var info = this.createElement('info', data);
                    el.append(active, toolbar, info);
                }

                break;
            case 'add':
                var el = this.createNode('div', {
                    class: 'modxnote__add',
                    title: _('modxnotes_item_create'),
                });
                el.innerText = '+';
                el.addEventListener('click', modxNotes.Events.add);

                break;
            case 'toolbar':
                var el = this.createNode('div', {
                    class: 'modxnote__toolbar',
                });
                if (data) {
                    var colors = this.createNode('ul', {
                        class: 'modxnote-colors',
                    });

                    for (var key in modxNotes.colors) {
                        var tmp = this.createNode('li', {
                            class: 'modxnote-color modxnote--' + key,
                            title: _('modxnotes_item_color_' + key),
                        });
                        var color = data.color || 'white';
                        if (color == key) {
                            tmp.classList.add('modxnote-color--active');
                        }
                        tmp.dataset.color = modxNotes.colors[key] ? key : '';
                        tmp.addEventListener('click', modxNotes.Events.changeColor);

                        colors.append(tmp);
                    }
                    var activeClass = data.active ? ' active' : '';
                    var active = this.createNode('span', {
                        class: 'modxnote__active' + activeClass,
                        title: data.active ? _('modxnotes_item_disable') : _('modxnotes_item_enable'),
                    });
                    active.addEventListener('click', modxNotes.Events.changeStatus);

                    el.append(active, colors);
                }

                break;
            case 'info':
                var el = this.createNode('div', {
                        class: 'modxnote__info',
                    }),
                    user = this.createNode('a', {
                        href: '/manager/?a=security/user/update&id=' + data.user_id,
                        class: 'modxnote__user',
                        target: '_blank',
                        title: String.format(_('modxnotes_item_to_user'), this.ucFirst(data.user))
                    }, this.ucFirst(data.user)),
                    created_at = this.createNode('span', {
                        class: 'modxnote__created_at',
                        datetime: data.created_at,
                        title: _('modxnotes_item_created_at') + ': ' + this.formatDate(data.created_at)
                    }, this.formatDate(data.created_at));

                el.append(user, created_at);
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
            } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                serialized[field.name] = field.value;
            }
        }
        return serialized;
    },
    ucFirst: function (str) {
        if (!str) return str;
        return str[0].toUpperCase() + str.slice(1);
    },
    formatDate: function (string) {
        if (string && string != '0000-00-00 00:00:00' && string != '-1-11-30 00:00:00' && string != 0) {
            let date = /^[0-9]+$/.test(string)
                ? new Date(string * 1000)
                : new Date(string.replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1'));

            return strftime(modxNotes.config.dateFormat, date);
        } else {
            return '&nbsp;';
        }
    }
};