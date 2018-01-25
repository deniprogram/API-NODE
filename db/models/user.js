var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            unique: { msg: 'E-mail já existe' }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
        },
        token_device: {
            type: DataTypes.STRING
        },
        platform_device: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        sms_confirm_phone: {
            type: DataTypes.STRING
        },
        sharing_code: {
            type: DataTypes.STRING,
            unique: true
        },
    }, {
        hooks: {
            beforeCreate: function(values) {
                values.password = bcrypt.hashSync(values.password);
            },
            beforeUpdate: function(values) {
                if (values.password && values.password.length < 30) {
                    values.password = bcrypt.hashSync(values.password);
                }
            }
        }
    });

    return User;
};
