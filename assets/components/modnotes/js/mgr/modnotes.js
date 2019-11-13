modNotes.init = function() {
    this.typingTimeout = null;  // Отсчёт времени после ввода в поле
    this.savingTimeout = null;  // Отсчёт времени с начала сохранения элемента
    this.dragEl = null;         // Свойство в котором будет храниться сортируемый элемент

    this.total = 0;
    this.count = 0;
    this.limit = 12;

    this.loading = false;

    this.reload = function(data, reload = false) {
        this.Ajax('mgr/item/getlist', data, null, reload);
    }

    this.elements = {
        head: document.head || document.getElementsByTagName('head')[0],
        wrapper: document.getElementById('modnotes-panel-home-div').nextElementSibling.firstElementChild,
        header: this.Utils.createNode('h2', {
            class: 'modnotes__header',
            title: _('modnotes'),
        }, _('modnotes')),
        grid: this.Utils.createNode('div', { class: 'modnote-grid' }),
    };

    this.elements.wrapper.addEventListener('scroll', function(e) {
        if (modNotes.loading) { return false; }
        var scroll = this.scrollTop + window.innerHeight - 110;
        var gridHeight = modNotes.elements.grid.offsetHeight;
        if (modNotes.count < modNotes.total && scroll > gridHeight) {
            modNotes.reload({
                start: modNotes.count,
                limit: modNotes.limit,
            });
        }
    });
    this.elements.wrapper.prepend(this.elements.header);
    this.elements.wrapper.append(this.elements.grid);

    modNotes.reload({
        start: 0,
        limit: this.limit,
    });

    // Ренедерим стили в <head>

    this.colors = {
        white: '',
        green: 'a7ffeb',
        yellow: 'ffc629',
        red: 'f28b82',
    };

    var css = '';
    for (var color in this.colors) {
        if (this.colors[color]) {
            css += '.modnote--' + color + ' { background-color: #' + this.colors[color] + ' !important; } ';    // Здесь подготавливаются стили
        }
    }

    var styles = document.createElement('style');
    this.elements.head.appendChild(styles);
    styles.type = 'text/css';
    styles.appendChild(document.createTextNode(css));

    // Навешиваем функцию которая будет удалять некоторые классы (они добавляются при определенных ситуациях в коде выше) на клик вне заметки

    document.addEventListener('click', function(e) {
        var target = e.target;
        if (!target.classList.contains('modnote') && !target.closest('.modnote')) {
            modNotes.elements.grid.classList.remove('modnote-grid--updating');
            modNotes.elements.grid.querySelectorAll('.modnote--updating').forEach(function(el) {
                el.classList.remove('modnote--updating');
            });
        }
    });
};