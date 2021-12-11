exports.up = pgm => {
    pgm.createTable('likes', {
        id: {
            type: 'VARCHAR(50)',
            notNull: true,
            primaryKey: true
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            referencesConstraintName: 'fk_likes_users',
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        comment: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'comments',
            referencesConstraintName: 'fk_likes_comments',
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        date: {
            type: 'TIMESTAMP',
            default: 'NOW()'
        }
    }, {
        ifNotExists: true
    })
}

exports.down = pgm => {
    pgm.dropTable('likes', {
        ifExists: true,
        cascase: true
    })
}
