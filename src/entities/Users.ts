import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum UserRole {
    Admin = "Admin",
    USER = "User",
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER, // Default role
  })
  role: UserRole;
}
