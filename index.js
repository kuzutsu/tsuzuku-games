const
    database = [],
    delay = 1000,
    episodes = [],
    green = '#2e7d32',
    max = {
        episode: null,
        year: null
    },
    min = {
        episode: null,
        year: null
    },
    operators = ['', '<', '>', '<=', '>='],
    red = '#c62828',
    seasons = ['fall', 'spring', 'summer', 'winter'],
    tags = [],
    years = [];

fetch('https://raw.githubusercontent.com/manami-project/anime-offline-database/master/anime-offline-database.json')
    .then((response) => response.json())
    .then((data) => {
        const d = data.data;

        for (let i = 0; i < d.length; i++) {
            const
                e = d[i].episodes,
                m = d[i].sources.filter((sources) => sources.match(/kitsu\.io|myanimelist\.net/gu)),
                y = d[i].animeSeason.year;

            let source = null;

            if (!m.length) {
                continue;
            }

            if (!d[i].episodes) {
                continue;
            }

            if (d[i].sources.filter((sources) => sources.match(/myanimelist\.net/gu)).length) {
                source = /myanimelist\.net/gu;
            } else {
                source = /kitsu\.io/gu;
            }

            for (const value of d[i].sources.filter((sources) => sources.match(source))) {
                const tt = d[i].tags.map((t) => t.replace(/\s/gu, '_'));

                for (const value2 of tt) {
                    if (tags.indexOf(value2) === -1) {
                        tags.push(value2);
                    }
                }

                if (years.indexOf(y) === -1) {
                    years.push(y);
                }

                if (episodes.indexOf(e) === -1) {
                    episodes.push(e);
                }

                database.push({
                    episodes: e,
                    link: value,
                    picture:
                        d[i].picture.match(/myanimelist\.net/gu)
                            ? d[i].picture.replace(d[i].picture.substr(d[i].picture.lastIndexOf('.')), '.webp')
                            : d[i].picture,
                    season: d[i].animeSeason.season.toLowerCase(),
                    source:
                        value.match(/myanimelist\.net/gu)
                            ? 'https://myanimelist.net/img/common/pwa/launcher-icon-4x.png'
                            : 'https://kitsu.io/favicon-194x194-2f4dbec5ffe82b8f61a3c6d28a77bc6e.png',
                    tags: tt,
                    thumbnail:
                        d[i].thumbnail.match(/myanimelist\.net/gu)
                            ? d[i].thumbnail.replace(d[i].thumbnail.substr(d[i].thumbnail.lastIndexOf('.')), '.webp')
                            : d[i].thumbnail,
                    title: d[i].title,
                    year: y
                });
            }
        }

        tags.sort();
        episodes.sort();
        years.sort();
        years.splice(years.indexOf(null), 1);

        max.episode = Math.max(...episodes);
        min.episode = Math.min(...episodes);

        max.year = Math.max(...years);
        min.year = Math.min(...years);

        years.push(null);

        function game() {
            document.querySelector('.score').innerHTML = localStorage.getItem('score');

            if (document.querySelector('.choice').innerHTML) {
                document.querySelector('.choice').innerHTML = '';
            }

            const
                choice = Math.round(Math.random() * (Number(localStorage.getItem('choices')) - 1)),
                operator = operators[Math.round(Math.random() * (operators.length - 1))],
                season = seasons[Math.round(Math.random() * (seasons.length - 1))],
                tag = tags[Math.round(Math.random() * (tags.length - 1))];

            let episode = episodes[Math.round(Math.random() * (episodes.length - 1))],
                year = years[Math.round(Math.random() * (years.length - 1))];

            document.querySelector('.query a').href = 'https://kuzutsu.github.io/tsuzuku/?query=';

            switch (localStorage.getItem('type')) {
                case 'episodes (without operators)':
                    document.querySelector('.query a').href += encodeURIComponent(`episodes:${episode}`);
                    document.querySelector('.query a').innerHTML = `episodes:<span class="bold">${episode}</span>`;
                    break;

                case 'episodes (with operators)':
                    switch (operator) {
                        case '<':
                            while (episode === min.episode) {
                                episode = episodes[Math.round(Math.random() * (episodes.length - 1))];
                            }
                            break;

                        case '>':
                            while (episode === max.episode) {
                                episode = episodes[Math.round(Math.random() * (episodes.length - 1))];
                            }
                            break;

                        default:
                            break;
                    }

                    document.querySelector('.query a').href += encodeURIComponent(`episodes:${operator + episode}`);
                    document.querySelector('.query a').innerHTML = `episodes:<span class="bold">${operator + episode}</span>`;
                    break;

                case 'season':
                    document.querySelector('.query a').href += encodeURIComponent(`season:${season}`);
                    document.querySelector('.query a').innerHTML = `season:<span class="bold">${season}</span>`;
                    break;

                case 'year (without operators)':
                    document.querySelector('.query a').href += encodeURIComponent(`year:${year}`);
                    document.querySelector('.query a').innerHTML = `year:<span class="bold">${year}</span>`;
                    break;

                case 'year (with operators)':
                    switch (operator) {
                        case '<':
                            while (year === min.year) {
                                year = years[Math.round(Math.random() * (years.length - 1))];
                            }
                            break;

                        case '>':
                            while (year === max.year) {
                                year = years[Math.round(Math.random() * (years.length - 1))];
                            }
                            break;

                        default:
                            break;
                    }

                    document.querySelector('.query a').href += encodeURIComponent(`year:${
                        year
                            ? operator + year
                            : 'tba'
                    }`);

                    document.querySelector('.query a').innerHTML = `year:<span class="bold">${
                        year
                            ? operator + year
                            : 'tba'
                    }</span>`;

                    break;

                case 'tags':
                default:
                    document.querySelector('.query a').href += encodeURIComponent(`tags:${tag}`);
                    document.querySelector('.query a').innerHTML = `tags:<span class="bold">${tag}</span>`;
                    break;
            }

            for (let i = 0; i < Number(localStorage.getItem('choices')); i++) {
                const div = document.createElement('div');
                let random = Math.round(Math.random() * (database.length - 1));

                if (i === choice) {
                    switch (localStorage.getItem('type')) {
                        case 'episodes (without operators)':
                            while (database[random].episodes !== episode) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'episodes (with operators)':
                            switch (operator) {
                                case '<':
                                    while (database[random].episodes >= episode) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '>':
                                    while (database[random].episodes <= episode) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '<=':
                                    while (database[random].episodes > episode) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '>=':
                                    while (database[random].episodes < episode) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                default:
                                    while (database[random].episodes !== episode) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;
                            }
                            break;

                        case 'season':
                            while (database[random].season !== season) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'year (without operators)':
                            while (database[random].year !== year) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'year (with operators)':
                            switch (operator) {
                                case '<':
                                    while (!database[random].year || database[random].year >= year) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '>':
                                    while (database[random].year <= year) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '<=':
                                    while (!database[random].year || database[random].year > year) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '>=':
                                    while (database[random].year < year) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                default:
                                    while (database[random].year !== year) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;
                            }
                            break;

                        case 'tags':
                        default:
                            while (database[random].tags.indexOf(tag) === -1) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;
                    }

                    div.addEventListener('click', (e) => {
                        if (e.target.classList.contains('source')) {
                            return;
                        }

                        if (document.querySelector('.choice div[style]')) {
                            return;
                        }

                        e.currentTarget.style.background = green;
                        localStorage.setItem('score', Number(localStorage.getItem('score')) + 1);
                        document.querySelector('.score').innerHTML = localStorage.getItem('score');
                        setTimeout(() => {
                            game();
                        }, delay);
                    });
                } else {
                    switch (localStorage.getItem('type')) {
                        case 'episodes (without operators)':
                            while (database[random].episodes === episode) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'episodes (with operators)':
                            switch (operator) {
                                case '<':
                                    while (database[random].episodes < episode) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '>':
                                    while (database[random].episodes > episode) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '<=':
                                    while (database[random].episodes <= episode) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '>=':
                                    while (database[random].episodes >= episode) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                default:
                                    while (database[random].episodes === episode) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;
                            }
                            break;

                        case 'season':
                            while (database[random].season === season) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'year (without operators)':
                            while (database[random].year === year) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'year (with operators)':
                            switch (operator) {
                                case '<':
                                    while (database[random].year && database[random].year < year) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '>':
                                    while (database[random].year > year) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '<=':
                                    while (database[random].year && database[random].year <= year) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                case '>=':
                                    while (database[random].year >= year) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;

                                default:
                                    while (database[random].year === year) {
                                        random = Math.round(Math.random() * (database.length - 1));
                                    }
                                    break;
                            }
                            break;

                        case 'tags':
                        default:
                            while (database[random].tags.indexOf(tag) > -1) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;
                    }

                    div.addEventListener('click', (e) => {
                        if (e.target.classList.contains('source')) {
                            return;
                        }

                        if (document.querySelector('.choice div[style]')) {
                            return;
                        }

                        e.currentTarget.style.background = red;
                        document.querySelector(`.choice div:nth-child(${choice + 1})`).style.background = green;
                        localStorage.setItem('score', Number(localStorage.getItem('score')) - 1);
                        document.querySelector('.score').innerHTML = localStorage.getItem('score');
                        setTimeout(() => {
                            game();
                        }, delay);
                    });
                }

                switch (localStorage.getItem('thumbnails')) {
                    case 'disable':
                        div.innerHTML = '<span class="no-picture"></span>';
                        break;

                    case 'enable (low quality)':
                        div.innerHTML = `<img class="picture" src="${database[random].thumbnail}" loading="lazy" alt></img>`;
                        break;

                    case 'enable (high quality)':
                    default:
                        div.innerHTML = `<img class="picture" src="${database[random].picture}" loading="lazy" alt></img>`;
                        break;
                }

                div.innerHTML +=
                    '<span class="separator"></span>' +
                    `<a class="link" href="${database[random].link}" target="_blank" rel="noreferrer">` +
                        `<img class="source" src="${database[random].source}" loading="lazy" alt>` +
                    '</a>' +
                    '<span class="separator"></span>' +
                    `<span class="title">${database[random].title}</span>`;

                document.querySelector('.choice').appendChild(div);
            }
        }

        game();

        document.querySelector('.thumbnails').addEventListener('change', (e) => {
            localStorage.setItem('thumbnails', e.currentTarget.value);
            localStorage.setItem('score', 0);
            game();
        });

        document.querySelector('.choices').addEventListener('change', (e) => {
            localStorage.setItem('choices', e.currentTarget.value);
            localStorage.setItem('score', 0);
            game();
        });

        document.querySelector('.type').addEventListener('change', (e) => {
            localStorage.setItem('type', e.currentTarget.value);
            localStorage.setItem('score', 0);
            game();
        });

        document.querySelector('.settings').addEventListener('click', () => {
            for (const i of document.querySelectorAll('.setting')) {
                if (i.style.display) {
                    i.style.display = '';
                } else {
                    i.style.display = 'flex';
                }
            }
        });

        document.querySelector('.score').addEventListener('click', (e) => {
            localStorage.setItem('score', 0);
            e.currentTarget.innerHTML = localStorage.getItem('score');
        });

        document.querySelector('.reload svg').addEventListener('click', () => {
            game();
        });
    });