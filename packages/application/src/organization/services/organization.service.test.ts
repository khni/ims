import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrganizationModuleService } from "./organization.service.js";
import { OrganizationErrorCode } from "../errors/errorCode.js";

// Mock types
const mockContext = {
  userId: "user-1",
} as any;

describe("OrganizationModuleService", () => {
  let mockRepository: any;
  let mockModuleService: any;
  let service: OrganizationModuleService;

  beforeEach(() => {
    mockRepository = {};

    mockModuleService = {
      setConfig: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findById: vi.fn(),
      filteredPaginatedList: vi.fn(),
    };

    service = new OrganizationModuleService(mockRepository, mockModuleService);
  });

  // ===============================
  // CREATE
  // ===============================
  it("should call moduleService.create with correct uniqueChecker", async () => {
    const mockCreateExecutor = vi.fn().mockResolvedValue({ id: "org-1" });

    // stub create to return function
    mockModuleService.create.mockReturnValue(mockCreateExecutor);

    const result = await service.create({
      context: mockContext,
      data: { name: "Test Org" } as any,
    });

    // ✅ ensure create was called correctly
    expect(mockModuleService.create).toHaveBeenCalledWith({
      uniqueChecker: [
        {
          keys: ["name", "ownerId"],
          errorKey: OrganizationErrorCode.MODULE_NAME_CONFLICT,
        },
      ],
    });

    // ✅ ensure executor called with ownerId injected
    expect(mockCreateExecutor).toHaveBeenCalledWith({
      context: mockContext,
      data: {
        name: "Test Org",
        ownerId: "user-1",
      },
    });

    expect(result).toEqual({ id: "org-1" });
  });

  // ===============================
  // UPDATE
  // ===============================
  it("should inject ownerId during update", async () => {
    const mockUpdateExecutor = vi.fn().mockResolvedValue({ id: "org-1" });

    mockModuleService.update.mockReturnValue(mockUpdateExecutor);

    await service.update({
      context: mockContext,
      id: "org-1",
      data: { name: "Updated Org" } as any,
    });

    expect(mockUpdateExecutor).toHaveBeenCalledWith({
      context: mockContext,
      id: "org-1",
      data: {
        name: "Updated Org",
        ownerId: "user-1",
      },
    });
  });

  it("should delegate filteredPaginatedList to moduleService", async () => {
    const mockExecutor = vi.fn().mockResolvedValue({
      items: [{ id: "org-1", name: "Test Org" }],
      total: 1,
      page: 1,
      limit: 10,
    });

    // 🔹 Stub filteredPaginatedList to return executor
    mockModuleService.filteredPaginatedList.mockReturnValue(mockExecutor);

    const query = {
      filters: { name: "Test" },
      // orderBy: { createdAt: "desc" },
      page: 1,
      pageSize: 10,
    };

    const result = await service.filteredPaginatedList({
      context: mockContext,
      query,
    });

    // ✅ ensure factory method called
    expect(mockModuleService.filteredPaginatedList).toHaveBeenCalled();

    // ✅ ensure executor called with correct params
    expect(mockExecutor).toHaveBeenCalledWith({
      context: mockContext,
      query,
    });

    // ✅ ensure result is returned
    expect(result).toEqual({
      items: [{ id: "org-1", name: "Test Org" }],
      total: 1,
      page: 1,
      limit: 10,
    });
  });

  // ===============================
  // FIND BY ID
  // ===============================
  it("should delegate findById", async () => {
    const mockFindExecutor = vi.fn().mockResolvedValue({ id: "org-1" });

    mockModuleService.findById.mockReturnValue(mockFindExecutor);

    const result = await service.findById({
      context: mockContext,
      id: "org-1",
    });

    expect(mockFindExecutor).toHaveBeenCalledWith({
      context: mockContext,
      id: "org-1",
    });

    expect(result).toEqual({ id: "org-1" });
  });
});
