exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            notNull: true,
            primaryKey: true
        },
        content: {
            type: 'TEXT',
            notNull: true
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            referencesConstraintName: 'fk_comments_users',
            onDelete: 'cascade',
            onUpdate: 'cascade'
        }
    }, {
        ifNotExists: true
    })
}

exports.down = pgm => {
    pgm.dropTable('comments', {
        ifExists: true,
        cascade: true
    })
}
