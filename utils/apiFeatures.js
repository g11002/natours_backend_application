class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        //BUILD THE QUERY
        //1a) Filtering
        const queryObj = { ...this.queryString }; //this.queryString: req.query
        const excludedFieds = ['page', 'sort', 'limit', 'field'];
        excludedFieds.forEach(el => delete queryObj[el]);
        console.log('req.query: ',this.queryString);
        console.log('queryObj: ', queryObj);

        //1b) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log('queryStr: ', JSON.parse(queryStr));

        // { difficulty: 'easy', duration: {$gte: 5} }
        // { difficulty: 'easy', duration: {gte: 5} }
        // gte, gt, lte, lt --> 127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy

        //let query = Tour.find(JSON.parse(queryStr)); 
        this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log('sortby: ',sortBy);
            this.query = this.query.sort(this.queryString.sort); //127.0.0.1:3000/api/v1/tours?sort=+price, +price for ascending and -price for descending
            //sort('price rating average')                       //127.0.0.1:3000/api/v1/tours?sort=+price,ratingsAverage
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.field) {
            const field = this.queryString.field.split(',').join(' ');
            console.log('field: ',field);
            this.query = this.query.select(field);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        if(this.queryString.page) {
            const numTours = Tour.countDocuments(); //const numTours = await Tour.countDocuments()
            if(skip > numTours) throw new Error('This page does not exist');
        }

        return this;
    }
}

module.exports = APIFeatures;