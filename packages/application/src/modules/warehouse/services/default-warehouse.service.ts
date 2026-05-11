//Add optional bins array to create repository

import { Context } from "@avuny/core";
import { PrismaTransactionManager } from "@avuny/db";
import { WarehouseRepository } from "../repositories/warehouse.repository.js";
import { IActivityLogService } from "../../../shared.js";
export class DefaultWarehouseService {
  private warehouseRepository: WarehouseRepository;
  private activityLog: IActivityLogService;
  constructor({
    warehouseRepository,
    activityLog,
  }: {
    warehouseRepository: WarehouseRepository;
    activityLog: IActivityLogService;
  }) {
    this.warehouseRepository = warehouseRepository;
    this.activityLog = activityLog;
  }
  private defaultWarehouses = [
    {
      name: "default-warehouse",
      type: "PHYSICAL",
      description: null,
      bins: [{ code: "BIN-A1", binPosition: "A1" }],
    },
    {
      name: "opening-stock-warehouse",
      type: "VIRTUAL",
      description: null,
      bins: [{ code: "BIN-A1", binPosition: "A1" }],
    },
    {
      name: "item-adjustment-warehouse",
      type: "VIRTUAL",
      description: null,
      bins: [{ code: "BIN-A1", binPosition: "A1" }],
    },
    { name: "customers-warehouse", type: "VIRTUAL", description: null },
    { name: "vendors-warehouse", type: "VIRTUAL", description: null },
  ];
  create = async (params: {
    context: Context;
    data: { organizationId: string };
    tx?: PrismaTransactionManager;
  }) => {
    const warehouses = await this.warehouseRepository.createTransaction(
      async (transaction) => {
        const tx = params.tx ?? transaction;
        const createdWarehouses = await Promise.all(
          this.defaultWarehouses.map(async (warehouse) => {
            const createdWarehouse = await this.warehouseRepository.create({
              data: {
                ...warehouse,
                organizationId: params.data.organizationId,
              },
              tx,
            });
            await this.activityLog.create({
              tx,
              data: {
                event: "create",
                organizationId: params.data.organizationId,
                resourceId: createdWarehouse.id,
                resourceType: "warehouse",
              },
            });
            return createdWarehouse;
          }),
        );
        return createdWarehouses;
      },
    );
    return warehouses.map((warehouse) => ({
      id: warehouse.id,
      name: warehouse.name,
    }));
  };
}
