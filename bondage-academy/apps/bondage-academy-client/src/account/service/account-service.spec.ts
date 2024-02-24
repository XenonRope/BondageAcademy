import { mock } from "ts-jest-mocker";
import { container } from "tsyringe";
import { SocketService } from "../../common/socket-service";
import { AccountService } from "./account-service";

let accountService: AccountService;
let socketService: SocketService;

beforeEach(() => {
  container.clearInstances();

  socketService = mock(SocketService);
  container.registerInstance(SocketService, socketService);
  accountService = container.resolve(AccountService);
});

describe("registerAccount", () => {
  test("Should emit register_account event", async () => {
    jest.spyOn(socketService, "emit");

    await accountService.registerAccount({
      username: "Alice",
      password: "password!",
      nick: "CuteAlice",
    });

    expect(socketService.emit).toHaveBeenCalledTimes(1);
    expect(socketService.emit).toHaveBeenCalledWith("register_account", {
      username: "Alice",
      password: "password!",
      nick: "CuteAlice",
    });
  });
});
