import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1738422586840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            role ENUM('Admin', 'User') NOT NULL DEFAULT 'User'
        );
    `);
    await queryRunner.query(`CREATE INDEX idx_email ON users(email)`);
    await queryRunner.query(` 
        INSERT INTO users(name, email, role) VALUES('Admin user', 'admin@gmail.com', 'Admin')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
