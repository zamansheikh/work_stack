const { body, validationResult } = require('express-validator');

// Validation rules for feature creation/update
const featureValidation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Feature name must be between 3 and 200 characters'),

    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),

    body('purpose')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Purpose must be between 10 and 2000 characters'),

    body('implementation')
        .trim()
        .isLength({ min: 10, max: 3000 })
        .withMessage('Implementation details must be between 10 and 3000 characters'),

    body('technicalDetails')
        .trim()
        .isLength({ min: 10, max: 3000 })
        .withMessage('Technical details must be between 10 and 3000 characters'),

    body('status')
        .optional()
        .isIn(['planned', 'in-progress', 'completed', 'on-hold'])
        .withMessage('Status must be one of: planned, in-progress, completed, on-hold'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be one of: low, medium, high, critical'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
        .custom((tags) => {
            if (tags.length > 10) {
                throw new Error('Maximum 10 tags allowed');
            }
            for (const tag of tags) {
                if (typeof tag !== 'string' || tag.trim().length === 0 || tag.length > 50) {
                    throw new Error('Each tag must be a non-empty string with maximum 50 characters');
                }
            }
            return true;
        }),

    body('author')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Author name must be between 2 and 100 characters')
];

// Validation rules for login
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

// Middleware to check validation results
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors
        });
    }

    next();
};

module.exports = {
    featureValidation,
    loginValidation,
    checkValidation
};
