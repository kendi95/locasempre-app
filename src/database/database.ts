export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      addresses: {
        Row: {
          address: string
          city: string
          complement: string
          createdAt: string | null
          id: string
          neighborhood: string
          numberAddress: number
          provincy: string
          updatedAt: string | null
          zipcode: string
        }
        Insert: {
          address: string
          city: string
          complement: string
          createdAt?: string | null
          id: string
          neighborhood: string
          numberAddress: number
          provincy: string
          updatedAt?: string | null
          zipcode: string
        }
        Update: {
          address?: string
          city?: string
          complement?: string
          createdAt?: string | null
          id?: string
          neighborhood?: string
          numberAddress?: number
          provincy?: string
          updatedAt?: string | null
          zipcode?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          addressId: string
          cpf: string
          createdAt: string | null
          id: string
          imageId: string | null
          name: string
          phone: string
          updatedAt: string | null
        }
        Insert: {
          addressId: string
          cpf: string
          createdAt?: string | null
          id: string
          imageId?: string | null
          name: string
          phone: string
          updatedAt?: string | null
        }
        Update: {
          addressId?: string
          cpf?: string
          createdAt?: string | null
          id?: string
          imageId?: string | null
          name?: string
          phone?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_addressId_fkey"
            columns: ["addressId"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_imageId_fkey"
            columns: ["imageId"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      delivered_addresses: {
        Row: {
          address: string
          city: string
          complement: string
          createdAt: string | null
          customersId: string | null
          id: string
          isDefaultAddress: boolean
          neighborhood: string
          numberAddress: number
          provincy: string
          updatedAt: string | null
          zipcode: string
        }
        Insert: {
          address: string
          city: string
          complement: string
          createdAt?: string | null
          customersId?: string | null
          id: string
          isDefaultAddress?: boolean
          neighborhood: string
          numberAddress: number
          provincy: string
          updatedAt?: string | null
          zipcode: string
        }
        Update: {
          address?: string
          city?: string
          complement?: string
          createdAt?: string | null
          customersId?: string | null
          id?: string
          isDefaultAddress?: boolean
          neighborhood?: string
          numberAddress?: number
          provincy?: string
          updatedAt?: string | null
          zipcode?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivered_addresses_customersId_fkey"
            columns: ["customersId"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          createdAt: string | null
          filename: string
          id: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string | null
          filename: string
          id: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string | null
          filename?: string
          id?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      images_in_order: {
        Row: {
          id: string
          imageId: string
          orderId: string
        }
        Insert: {
          id: string
          imageId: string
          orderId: string
        }
        Update: {
          id?: string
          imageId?: string
          orderId?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_in_order_imageId_fkey"
            columns: ["imageId"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "images_in_order_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          amountInCents: number
          createdAt: string | null
          id: string
          imageId: string | null
          isActive: boolean
          name: string
          updatedAt: string | null
        }
        Insert: {
          amountInCents: number
          createdAt?: string | null
          id: string
          imageId?: string | null
          isActive?: boolean
          name: string
          updatedAt?: string | null
        }
        Update: {
          amountInCents?: number
          createdAt?: string | null
          id?: string
          imageId?: string | null
          isActive?: boolean
          name?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_imageId_fkey"
            columns: ["imageId"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      items_in_order: {
        Row: {
          createdAt: string | null
          id: string
          itemId: string
          orderId: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string | null
          id: string
          itemId: string
          orderId: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: string
          itemId?: string
          orderId?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_in_order_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_in_order_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          collectedAt: string
          createdAt: string | null
          customerId: string
          deliveryAddressId: string
          id: string
          isCollected: boolean
          status: Database["public"]["Enums"]["Status"] | null
          takenAt: string
          totalAmountInCents: number
          updatedAt: string | null
        }
        Insert: {
          collectedAt: string
          createdAt?: string | null
          customerId: string
          deliveryAddressId: string
          id: string
          isCollected?: boolean
          status?: Database["public"]["Enums"]["Status"] | null
          takenAt: string
          totalAmountInCents: number
          updatedAt?: string | null
        }
        Update: {
          collectedAt?: string
          createdAt?: string | null
          customerId?: string
          deliveryAddressId?: string
          id?: string
          isCollected?: boolean
          status?: Database["public"]["Enums"]["Status"] | null
          takenAt?: string
          totalAmountInCents?: number
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_deliveryAddressId_fkey"
            columns: ["deliveryAddressId"]
            isOneToOne: false
            referencedRelation: "delivered_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      reset_user_account: {
        Row: {
          createdAt: string | null
          expiredAt: string
          id: string
          isReseted: boolean
          isValid: boolean
          updatedAt: string | null
          userId: string
        }
        Insert: {
          createdAt?: string | null
          expiredAt: string
          id: string
          isReseted?: boolean
          isValid?: boolean
          updatedAt?: string | null
          userId: string
        }
        Update: {
          createdAt?: string | null
          expiredAt?: string
          id?: string
          isReseted?: boolean
          isValid?: boolean
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "reset_user_account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          createdAt: string
          email: string
          id: string
          imageId: string | null
          isActive: boolean
          name: string
          password: string
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          imageId?: string | null
          isActive: boolean
          name: string
          password: string
          role?: Database["public"]["Enums"]["Role"]
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          imageId?: string | null
          isActive?: boolean
          name?: string
          password?: string
          role?: Database["public"]["Enums"]["Role"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_imageId_fkey"
            columns: ["imageId"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Role: "ADMINISTRATOR" | "USER"
      Status: "PENDING" | "PAID" | "CANCELED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
