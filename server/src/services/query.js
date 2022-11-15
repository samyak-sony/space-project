// we want any endpoint to use our pagination logic thus this query.js file gives us a reusable way of making any endpoint paginated

const DEFAULT_PAGE_LIMIT = 0; // if the default is 0, mongo returns all of the documents in the collection
const DEFAULT_PAGE_NUMBER = 1;

function getPagination(query) {
    // Pagination functino takes the query object
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const skip = (page-1) * limit;
    return {
        skip,
        limit,
    };
}

module.exports = {
    getPagination,
};