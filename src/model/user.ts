import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ modelName: "users" })
class User extends Model<User> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  public id: number;

  @Column({ type: DataType.CHAR })
  public name: string;
}

export default User;
