modxNotes.Ajax = function(action, data, form, reload = false) {
    if (!action) { return false; };

    modxNotes.loading = true;

    var defaultParams = {
        action: action,
        HTTP_MODAUTH: modxNotes.config.http_modauth,
    };

    var query = [];
    var data = Object.assign(defaultParams, data);
    for (var i in data) {
        query.push(i + '=' + data[i]);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', modxNotes.config.connectorUrl + '?' + query.join('&'));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                var data = JSON.parse(xhr.responseText);
                if (data.success) {
                    switch (action) {
                        case 'mgr/item/getlist':
                            modxNotes.elements.grid.classList.add('modnote-grid--loading');
                            modxNotes.total = data.total;

                            var tmp = [];
                            data.results.forEach(function(element) {
                                var col = modxNotes.Utils.createElement('column');
                                col.append(modxNotes.Utils.createElement('item', element));
                                tmp.push(col);
                            });

                            if (!modxNotes.count || reload) {
                                modxNotes.elements.grid.innerHTML = '';
                                tmp.map(function(el) {
                                    modxNotes.elements.grid.append(el);
                                });

                                var col = modxNotes.Utils.createElement('column', null, false);
                                col.append(modxNotes.Utils.createElement('add'));
                                modxNotes.elements.grid.append(col);
                                modxNotes.count = data.results.length;

                            } else {
                                var add = modxNotes.elements.grid.querySelector('.modnote-column--locked');
                                tmp.map(function(el) {
                                    modxNotes.elements.grid.insertBefore(el, add);
                                });

                                modxNotes.count += data.results.length;
                            }

                            modxNotes.elements.grid.classList.remove('modnote-grid--loading');
                            modxNotes.elements.grid.classList.remove('modnote-grid--updating');

                            break;
                        case 'mgr/item/changecolor':
                            var color = form.querySelector('[name=color]').value || 'white';
                            form.querySelector('.modnote-color--active').classList.remove('modnote-color--active');
                            form.querySelector('.modnote-color.modnote--' + color).classList.add('modnote-color--active');
                            form.className = 'modnote modnote--' + color;
                            break;
                        case 'mgr/item/enable':
                        case 'mgr/item/disable':
                            var status = form.querySelector('[name=active]').value;
                            if (status == 1) {
                                form.classList.remove('modnote--disabled');
                            } else {
                                form.classList.add('modnote--disabled');
                            }
                            break;
                        case 'mgr/item/create':
                            modxNotes.reload({
                                start: 0,
                                limit: ++modxNotes.count,
                            }, true);
                            break;
                        case 'mgr/item/remove':
                            form.parentNode.remove();
                            modxNotes.count--;
                            break;
                        case 'mgr/item/sort':
                            modxNotes.reload({
                                start: 0,
                                limit: modxNotes.count,
                            }, true);
                            break;
                    }
                } else {
                    data.data.forEach(function(el) {
                        var input = form.querySelector('[name=' + el.id + ']');
                        input.setAttribute('title', el.msg);
                        input.classList.add('error');
                    });
                }
            } catch(err) {
                console.log(err.message + ' in ' + xhr.responseText);
                return;
            }
            modxNotes.loading = false;
        }
    }
    xhr.send();
}