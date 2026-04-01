exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 100).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.enum('role', ['admin', 'superadmin']).notNullable().defaultTo('admin');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
