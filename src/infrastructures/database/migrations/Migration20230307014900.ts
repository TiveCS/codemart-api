import { Migration } from '@mikro-orm/migrations';

export class Migration20230307014900 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product" ("id" serial primary key, "owner_id" int not null, "title" varchar(255) not null, "description" varchar(255) not null, "version" varchar(255) not null, "image_url" varchar(255) null, "code_url" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('alter table "product" add constraint "product_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "product" cascade;');
  }

}
