import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DropDown,
  DropDownsExecute,
  DropDownsParam,
} from '../drop-drowns.interface';
import { MenuTypes } from '@prisma/client';

@Injectable()
export class DropDownsService {
  private readonly execute: DropDownsExecute = {
    'menu-items': () => this.getMenuItems(),
    'menu-items-drop-down': () => this.getMenuItemsDropDown(),
  };

  constructor(private readonly prismaService: PrismaService) {}

  async getDropDown(param: DropDownsParam) {
    const executeFunction = this.execute[param];
    if (!executeFunction) {
      throw new NotFoundException(`Dropdown for ${param} not found`);
    }
    return executeFunction();
  }

  private async getMenuItems(): Promise<DropDown> {
    return await this.prismaService.$queryRaw`
      SELECT id as "value", title as "label" from menu_items WHERE is_active = true ORDER BY "order_index" ASC;
    `;
  }

   private async getMenuItemsDropDown(): Promise<DropDown> {
    return await this.prismaService.$queryRaw`
      SELECT id as "value", title as "label" from menu_items WHERE is_active = true AND "type" = CAST(${MenuTypes.dropdown} AS "MenuTypes") ORDER BY "order_index" ASC;
    `;
  }
}
