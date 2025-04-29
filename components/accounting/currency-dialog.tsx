"use client"

import { FormDescription } from "@/components/ui/form"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface Currency {
  id: string
  code: string
  name: string
  symbol: string
  exchangeRate: number
  isBaseCurrency: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const formSchema = z.object({
  code: z
    .string()
    .min(3, { message: "Currency code must be at least 3 characters" })
    .max(3, { message: "Currency code must be exactly 3 characters" }),
  name: z.string().min(2, { message: "Currency name must be at least 2 characters" }),
  symbol: z.string().min(1, { message: "Currency symbol is required" }),
  exchangeRate: z.number().positive({ message: "Exchange rate must be positive" }),
  isBaseCurrency: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

interface CurrencyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currency: Currency | null
  onSave: (data: Partial<Currency>) => void
}

export function CurrencyDialog({ open, onOpenChange, currency, onSave }: CurrencyDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      symbol: "",
      exchangeRate: 1,
      isBaseCurrency: false,
      isActive: true,
    },
  })

  useEffect(() => {
    if (currency) {
      form.reset({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        exchangeRate: currency.exchangeRate,
        isBaseCurrency: currency.isBaseCurrency,
        isActive: currency.isActive,
      })
    } else {
      form.reset({
        code: "",
        name: "",
        symbol: "",
        exchangeRate: 1,
        isBaseCurrency: false,
        isActive: true,
      })
    }
  }, [currency, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{currency ? "Edit Currency" : "Add Currency"}</DialogTitle>
          <DialogDescription>
            {currency ? "Edit currency details" : "Add a new currency to the system"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency Code</FormLabel>
                    <FormControl>
                      <Input placeholder="USD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="$" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency Name</FormLabel>
                  <FormControl>
                    <Input placeholder="US Dollar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exchangeRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exchange Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0001"
                      placeholder="1.0000"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 1)}
                      disabled={form.watch("isBaseCurrency")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isBaseCurrency"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Base Currency</FormLabel>
                    <FormDescription>Set as the base currency for exchange rate calculations</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        if (checked) {
                          form.setValue("exchangeRate", 1)
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>Enable or disable this currency</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
