const {Tag} = require("../models");

module.exports = {
    getAllTags: (request, response) => {
        Tag.findAll()
       .then(tags => {
            response.render('tags', {tags});
       })
    },
    getOneTag: (request, response) => {
        const id = parseInt(request.params.id);
        Tag.findByPk(id, {
            include: {
                association: "quizzes",
                include: "author"
            }
        })
       .then(tag => {
            response.render('tag', {tag});
       })
    }
}