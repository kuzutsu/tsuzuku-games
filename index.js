const
    database = [],
    delay = 1000,
    episodes = [],
    green = '#2e7d32',
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
                e = d[i].episodes.toString(),
                m = d[i].sources.filter((sources) => sources.match(/kitsu\.io|myanimelist\.net/gu)),
                y = (d[i].animeSeason.year || 'TBA').toString();

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
                    picture:
                        d[i].thumbnail.match(/myanimelist\.net/gu)
                            ? d[i].thumbnail.replace(d[i].thumbnail.substr(d[i].thumbnail.lastIndexOf('.')), '.webp')
                            : d[i].thumbnail,
                    season: d[i].animeSeason.season.toLowerCase(),
                    source:
                        value.match(/myanimelist\.net/gu)
                            ? 'https://myanimelist.net/img/common/pwa/launcher-icon-4x.png'
                            : 'https://kitsu.io/favicon-194x194-2f4dbec5ffe82b8f61a3c6d28a77bc6e.png',
                    tags: tt,
                    title: d[i].title,
                    year: y
                });
            }
        }

        tags.sort();
        episodes.sort();
        years.sort();

        function game() {
            document.querySelector('.score').innerHTML = localStorage.getItem('score');

            if (document.querySelector('.choice').innerHTML) {
                document.querySelector('.choice').innerHTML = '';
            }

            const
                choice = Math.round(Math.random() * (Number(localStorage.getItem('choices')) - 1)),
                episode = episodes[Math.round(Math.random() * (episodes.length - 1))],
                season = seasons[Math.round(Math.random() * (seasons.length - 1))],
                tag = tags[Math.round(Math.random() * (tags.length - 1))],
                year = years[Math.round(Math.random() * (years.length - 1))];

            document.querySelector('.query a').href = 'https://kuzutsu.github.io/tsuzuku/?query=';

            switch (localStorage.getItem('type')) {
                case 'episodes':
                    document.querySelector('.query a').href += encodeURIComponent(`episodes:${episode}`);
                    document.querySelector('.query a').innerHTML = `episodes:<span class="bold">${episode}</span>`;
                    break;

                case 'season':
                    document.querySelector('.query a').href += encodeURIComponent(`season:${season}`);
                    document.querySelector('.query a').innerHTML = `season:<span class="bold">${season}</span>`;
                    break;

                case 'tags':
                    document.querySelector('.query a').href += encodeURIComponent(`tags:${tag}`);
                    document.querySelector('.query a').innerHTML = `tags:<span class="bold">${tag}</span>`;
                    break;

                case 'year':
                    document.querySelector('.query a').href += encodeURIComponent(`year:${year}`);
                    document.querySelector('.query a').innerHTML = `year:<span class="bold">${year}</span>`;
                    break;

                default:
                    break;
            }

            for (let i = 0; i < Number(localStorage.getItem('choices')); i++) {
                const div = document.createElement('div');
                let random = Math.round(Math.random() * (database.length - 1));

                if (i === choice) {
                    switch (localStorage.getItem('type')) {
                        case 'episodes':
                            while (database[random].episodes !== episode) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'season':
                            while (database[random].season !== season) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'tags':
                            while (database[random].tags.indexOf(tag) === -1) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'year':
                            while (database[random].year !== year) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        default:
                            break;
                    }

                    div.addEventListener('click', (e) => {
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
                        case 'episodes':
                            while (database[random].episodes === episode) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'season':
                            while (database[random].season === season) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'tags':
                            while (database[random].tags.indexOf(tag) > -1) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        case 'year':
                            while (database[random].year === year) {
                                random = Math.round(Math.random() * (database.length - 1));
                            }
                            break;

                        default:
                            break;
                    }

                    div.addEventListener('click', (e) => {
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

                if (localStorage.getItem('pictures') === 'disable') {
                    div.innerHTML = '<span class="no-picture"></span>';
                } else {
                    div.innerHTML = `<img class="picture" src="${database[random].picture}" loading="lazy" alt></img>`;
                }

                div.innerHTML += `<img class="source" src="${database[random].source}" loading="lazy" alt><span class="title">${database[random].title}</span>`;
                document.querySelector('.choice').appendChild(div);
            }
        }

        game();

        document.querySelector('.pictures').addEventListener('change', (e) => {
            localStorage.setItem('pictures', e.currentTarget.value);
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

        document.querySelector('.score').addEventListener('click', (e) => {
            localStorage.setItem('score', 0);
            e.currentTarget.innerHTML = localStorage.getItem('score');
        });

        document.querySelector('.reload svg').addEventListener('click', () => {
            game();
        });
    });