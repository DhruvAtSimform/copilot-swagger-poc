export class CreateUserMailEvent {
  public readonly type: string;
  //   public readonly email: string;
  //   public readonly userName: string;
  public readonly payload: { [key: string]: string };
  constructor(type: string, email: string, userName: string) {
    this.type = type;
    this.payload = { email, userName };
  }
  // lengthy way i would say. but what ever
  // this is also a way to achive same result.
  // you can simply use access_modifier infront of properties inside constructor
  // to automatically achive the result.
}
