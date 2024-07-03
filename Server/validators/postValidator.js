const Joi = require('joi');

const postSchema = Joi.object({
    email: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string(),
    image: Joi.string().required()
});

function validatePost(data) {
    return postSchema.validate(data);
}

module.exports.validatePost = validatePost;
