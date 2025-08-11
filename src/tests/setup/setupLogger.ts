import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { Logger } from "winston";

import logger from "../../configs/logger/logger";

jest.mock("../../configs/logger/logger", () => ({
    __esModule: true,
    default: mockDeep<Logger>(),
}));

beforeEach(() => {
    mockReset(loggerMock);
});

export const loggerMock = logger as unknown as DeepMockProxy<Logger>;
