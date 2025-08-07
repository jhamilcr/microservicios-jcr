import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Contacto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombres!: string;

  @Column()
  apellidos!: string;

  @Column({ type: 'date' })
  fecha_nacimiento!: string;

  @Column()
  direccion!: string;

  @Column()
  celular!: string;

  @Column()
  correo!: string;
}
