export class LoginRequest {
  emailId: string;
  password: string;

  constructor(emailId = '', password = '') {
    this.emailId = emailId;
    this.password = password;
  }
}

export interface LoginResponse {
  userId: number;
  emailId: string;
  password: string;
  createdDate: string;
  projectName: string;
  fullName: string;
  mobileNo: string;
  extraId: number;
}
