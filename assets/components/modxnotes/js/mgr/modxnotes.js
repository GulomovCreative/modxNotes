modxNotes.init = function() {
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
        wrapper: document.getElementById('modxnotes-panel-home-div').nextElementSibling.firstElementChild,
        header: this.Utils.createNode('h2', {
            class: 'modxnotes__header',
            title: _('modxnotes'),
        }, _('modxnotes')),
        grid: this.Utils.createNode('div', { class: 'modxnote-grid' }),
    };

    this.elements.wrapper.addEventListener('scroll', function(e) {
        if (modxNotes.loading) { return false; }
        var scroll = this.scrollTop + window.innerHeight - 110;
        var gridHeight = modxNotes.elements.grid.offsetHeight;
        if (modxNotes.count < modxNotes.total && scroll > gridHeight) {
            modxNotes.reload({
                start: modxNotes.count,
                limit: modxNotes.limit,
            });
        }
    });
    this.elements.wrapper.prepend(this.elements.header);
    this.elements.wrapper.append(this.elements.grid);

    modxNotes.reload({
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
            css += '.modxnote--' + color + ' { background-color: #' + this.colors[color] + ' !important; } ';    // Здесь подготавливаются стили
        }
    }

    var styles = document.createElement('style');
    this.elements.head.appendChild(styles);
    styles.type = 'text/css';
    styles.appendChild(document.createTextNode(css));

    // Навешиваем функцию которая будет удалять некоторые классы (они добавляются при определенных ситуациях в коде выше) на клик вне заметки

    document.addEventListener('click', function(e) {
        var target = e.target;
        if (!target.classList.contains('modxnote') && !target.closest('.modxnote')) {
            modxNotes.elements.grid.classList.remove('modxnote-grid--updating');
            modxNotes.elements.grid.querySelectorAll('.modxnote--updating').forEach(function(el) {
                el.classList.remove('modxnote--updating');
            });
        }
    });
};