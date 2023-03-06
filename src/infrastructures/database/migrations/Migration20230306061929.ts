import { Migration } from '@mikro-orm/migrations';

export class Migration20230306061929 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "email" varchar(255) not null, "full_name" varchar(255) not null, "password" varchar(255) not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
