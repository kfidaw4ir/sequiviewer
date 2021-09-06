var api = {
    baseUrl: 'https://api.mangadex.org/',

    netRq: createNetRequest,

    book: {
        getGeneralList: (doneFn, errFn)=>{
            api.netRq(
                api.baseUrl + 'manga',
                'GET',
                doneFn, 
                errFn, 
                true
            );
        },

        search: class {
            constructor(query, rating, doneFn, errFn) {

                this.url = api.baseUrl + 'manga';
                this.usp = new URLSearchParams();
                this.offset = 0;
                this.doneFn = doneFn;
                this.errFn = errFn;
                this.limit = 10;
    
                this.usp.append('title', query);
                this.usp.append('contentRating', JSON.stringify(rating));
                this.usp.append('limit', this.limit);

                this.getResults();
            }

            getResults(odf, oef) {
                this.usp.set('offset', this.offset);

                api.netRq(
                    this.url + this.usp.toString(),
                    'GET',
                    odf || this.doneFn, 
                    oef || this.errFn, 
                    true
                );

                this.offset += this.limit;
            }
        },

        get: (doneFn, errFn)=>{

        },

        getRandom: (doneFn, errFn)=>{
            api.netRq(
                api.baseUrl + 'manga/random',
                'GET',
                doneFn, 
                errFn, 
                true
            );
        }
    },

    images: {
        cover: (doneFn, errFn)=>{

        }
    }
};

apiIsReady();