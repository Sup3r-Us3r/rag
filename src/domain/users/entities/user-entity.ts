import { randomUUID } from 'node:crypto';
import { EmailVO } from '@domain/shared/value-objects/email-vo';

export interface UserProps {
  id?: string;
  name: string;
  email: EmailVO;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  id: string;
  name: string;
  email: EmailVO;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  update(props: { name?: string }): void {
    if (props.name) {
      this.name = props.name;
    }

    this.updatedAt = new Date();
  }
}
