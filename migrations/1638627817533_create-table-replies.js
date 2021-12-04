exports.up = pgm => {
    pgm.createTable('replies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
            notNull: true
        },
        content: {
            type: 'TEXT',
            notNull: true
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            referencesConstraintName: 'fk_replies_users',
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        comment: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'comments',
            referencesConstraintName: 'fk_replies_comments',
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        date: {
            type: 'TIMESTAMP',
            default: 'NOW()'
        },
        is_deleted: {
            type: 'BOOLEAN',
            default: 'FALSE'
        }
    }, {
        ifNotExists: true
    })
}

exports.down = pgm => {
    pgm.dropTable('comment-replies', {
        ifExists: true,
        cascade: true
    })
}
