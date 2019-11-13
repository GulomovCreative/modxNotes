modNotes.Ajax = function(action, data, form, reload = false) {
    if (!action) { return false; };

    modNotes.loading = true;

    var defaultParams = {
        action: action,
        HTTP_MODAUTH: modNotes.config.http_modauth,
    };

    var query = [];
    var data = Object.assign(defaultParams, data);
    for (var i in data) {
        query.push(i + '=' + data[i]);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', modNotes.config.connectorUrl + '?' + query.join('&'));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                var data = JSON.parse(xhr.responseText);
                if (data.success) {
                    switch (action) {
                        case 'mgr/item/getlist':
                            modNotes.elements.grid.classList.add('modnote-grid--loading');
                            modNotes.total = data.total;

                            var tmp = [];
                            data.results.forEach(function(element) {
                                var col = modNotes.Utils.createElement('column');
                                col.append(modNotes.Utils.createElement('item', element));
                                tmp.push(col);
                            });

                            if (!modNotes.count || reload) {
                                modNotes.elements.grid.innerHTML = '';
                                tmp.map(function(el) {
                                    modNotes.elements.grid.append(el);
                                });

                                var col = modNotes.Utils.createElement('column', null, false);
                                col.append(modNotes.Utils.createElement('add'));
                                modNotes.elements.grid.append(col);
                                modNotes.count = data.results.length;

                            } else {
                                var add = modNotes.elements.grid.querySelector('.modnote-column--locked');
                                tmp.map(function(el) {
                                    modNotes.elements.grid.insertBefore(el, add);
                                });

                                modNotes.count += data.results.length;
                            }

                            modNotes.elements.grid.classList.remove('modnote-grid--loading');
                            modNotes.elements.grid.classList.remove('modnote-grid--updating');

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
                            modNotes.reload({
                                start: 0,
                                limit: ++modNotes.count,
                            }, true);
                            break;
                        case 'mgr/item/remove':
                            form.parentNode.remove();
                            modNotes.count--;
                            break;
                        case 'mgr/item/sort':
                            modNotes.reload({
                                start: 0,
                                limit: modNotes.count,
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
            modNotes.loading = false;
        }
    }
    xhr.send();
}