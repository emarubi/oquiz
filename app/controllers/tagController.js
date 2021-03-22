const {Tag} = require("../models");

module.exports = {
 /*    getAllTags: (request, response) => {
        Tag.findAll()
       .then(tags => {
            response.render('tags', {tags});
       })
    }, */
    getAllTags: async (request, response) => {
        try {
            const tags = await Tag.findAll();
            response.render('tags', {tags});
        } catch(error) {
        response.status(500).send(error);
        }
    },
    /* getOneTag: (request, response) => {
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
    } */
    getOneTag: async (request, response) => {
        try {
            const id = parseInt(request.params.id);
            const tag = await Tag.findByPk(id, {
                include: {
                    association: "quizzes",
                    include: "author"
                }
            })
            response.render('tag', {tag});
         } catch(error) {
            response.status(500).send(error);
         }
    }
}