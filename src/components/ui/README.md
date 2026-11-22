# UI Primitives (`src/components/ui`)

## Overview
Foundational design-system primitive library consisting of 56 standalone TSX modules (shadcn/ui architecture) with no barrel index or child subdirectories. Modules wrap accessible headless primitives (`radix-ui`, `@base-ui/react`, `vaul`, `cmdk`, `input-otp`, `react-day-picker`, `embla-carousel-react`, `recharts`, `react-hook-form`, `react-resizable-panels`, `sonner`, `next-themes`) and native HTML controls with Tailwind styling via `@/lib/utils`, `class-variance-authority` (CVA) variants, `lucide-react` icons, and `data-slot` attributes for parent/child CSS coordination. Interactive modules mark `"use client"`; static layout/style primitives (`alert.tsx`, `badge.tsx`, `breadcrumb.tsx`, `button-group.tsx`, `button.tsx`, `card.tsx`, `empty.tsx`, `input.tsx`, `item.tsx`, `kbd.tsx`, `native-select.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `skeleton.tsx`, `spinner.tsx`, `textarea.tsx`) omit `"use client"`.

## Interface
No subdirectories. Consumers import individual modules directly:

- `accordion.tsx` (`"use client"`, `radix-ui`): `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- `alert-dialog.tsx` (`"use client"`, `radix-ui`): `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogMedia`, `AlertDialogOverlay`, `AlertDialogPortal`, `AlertDialogTitle`, `AlertDialogTrigger`
- `alert.tsx` (CVA): `Alert`, `AlertTitle`, `AlertDescription`
- `aspect-ratio.tsx` (`"use client"`, `radix-ui`): `AspectRatio`
- `avatar.tsx` (`"use client"`, `radix-ui`): `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`
- `badge.tsx` (CVA, `radix-ui` Slot): `Badge`, `badgeVariants`
- `breadcrumb.tsx` (`radix-ui` Slot): `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`
- `button-group.tsx` (CVA, `radix-ui` Slot): `ButtonGroup`, `ButtonGroupSeparator`, `ButtonGroupText`, `buttonGroupVariants`
- `button.tsx` (CVA, `radix-ui` Slot): `Button`, `buttonVariants`
- `calendar.tsx` (`"use client"`, `react-day-picker`): `Calendar`, `CalendarDayButton`
- `card.tsx`: `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardAction`, `CardDescription`, `CardContent`
- `carousel.tsx` (`"use client"`, `embla-carousel-react`): `CarouselApi` (type), `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`
- `chart.tsx` (`"use client"`, `recharts`): `ChartConfig` (type), `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartStyle`
- `checkbox.tsx` (`"use client"`, `radix-ui`): `Checkbox`
- `collapsible.tsx` (`"use client"`, `radix-ui`): `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`
- `combobox.tsx` (`"use client"`, `@base-ui/react`): `Combobox`, `ComboboxInput`, `ComboboxContent`, `ComboboxList`, `ComboboxItem`, `ComboboxGroup`, `ComboboxLabel`, `ComboboxCollection`, `ComboboxEmpty`, `ComboboxSeparator`, `ComboboxChips`, `ComboboxChip`, `ComboboxChipsInput`, `ComboboxTrigger`, `ComboboxValue`, `useComboboxAnchor`
- `command.tsx` (`"use client"`, `cmdk`): `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator`
- `context-menu.tsx` (`"use client"`, `radix-ui`): `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuGroup`, `ContextMenuPortal`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuRadioGroup`
- `dialog.tsx` (`"use client"`, `radix-ui`): `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`
- `direction.tsx` (`"use client"`, `radix-ui`): `DirectionProvider`, `useDirection`
- `drawer.tsx` (`"use client"`, `vaul`): `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerTrigger`, `DrawerClose`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription`
- `dropdown-menu.tsx` (`"use client"`, `radix-ui`): `DropdownMenu`, `DropdownMenuPortal`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`
- `empty.tsx` (CVA): `Empty`, `EmptyHeader`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`, `EmptyMedia`
- `field.tsx` (`"use client"`, CVA): `FieldErrorsList` (type), `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldLegend`, `FieldSeparator`, `FieldSet`, `FieldContent`, `FieldTitle`
- `form.tsx` (`"use client"`, `react-hook-form`, `radix-ui` Slot): `useFormField`, `Form`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `FormField`
- `hover-card.tsx` (`"use client"`, `radix-ui`): `HoverCard`, `HoverCardTrigger`, `HoverCardContent`
- `input-group.tsx` (`"use client"`, CVA): `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea`
- `input-otp.tsx` (`"use client"`, `input-otp`): `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator`
- `input.tsx`: `Input`
- `item.tsx` (CVA, `radix-ui` Slot): `Item`, `ItemMedia`, `ItemContent`, `ItemActions`, `ItemGroup`, `ItemSeparator`, `ItemTitle`, `ItemDescription`, `ItemHeader`, `ItemFooter`
- `kbd.tsx`: `Kbd`, `KbdGroup`
- `label.tsx` (`"use client"`, `radix-ui`): `Label`
- `menubar.tsx` (`"use client"`, `radix-ui`): `Menubar`, `MenubarPortal`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarGroup`, `MenubarSeparator`, `MenubarLabel`, `MenubarItem`, `MenubarShortcut`, `MenubarCheckboxItem`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`
- `native-select.tsx`: `NativeSelect`, `NativeSelectOptGroup`, `NativeSelectOption`
- `navigation-menu.tsx` (CVA, `radix-ui`): `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuContent`, `NavigationMenuTrigger`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuViewport`, `navigationMenuTriggerStyle`
- `pagination.tsx`: `Pagination`, `PaginationContent`, `PaginationLink`, `PaginationItem`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`
- `popover.tsx` (`"use client"`, `radix-ui`): `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription`
- `progress.tsx` (`"use client"`, `radix-ui`): `Progress`
- `radio-group.tsx` (`"use client"`, `radix-ui`): `RadioGroup`, `RadioGroupItem`
- `resizable.tsx` (`"use client"`, `react-resizable-panels`): `ResizableHandle`, `ResizablePanel`, `ResizablePanelGroup`
- `scroll-area.tsx` (`"use client"`, `radix-ui`): `ScrollArea`, `ScrollBar`
- `select.tsx` (`"use client"`, `radix-ui`): `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue`
- `separator.tsx` (`"use client"`, `radix-ui`): `Separator`
- `sheet.tsx` (`"use client"`, `radix-ui`): `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`
- `sidebar.tsx` (`"use client"`, CVA, `radix-ui` Slot, `@/hooks/use-mobile`): `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInput`, `SidebarInset`, `SidebarMenu`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem`, `SidebarProvider`, `SidebarRail`, `SidebarSeparator`, `SidebarTrigger`, `useSidebar`
- `skeleton.tsx`: `Skeleton`
- `slider.tsx` (`"use client"`, `radix-ui`): `Slider`
- `sonner.tsx` (`"use client"`, `sonner`, `next-themes`): `Toaster`
- `spinner.tsx`: `Spinner`
- `switch.tsx` (`"use client"`, `radix-ui`): `Switch`
- `table.tsx` (`"use client"`): `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption`
- `tabs.tsx` (`"use client"`, CVA, `radix-ui`): `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants`
- `textarea.tsx`: `Textarea`
- `toggle-group.tsx` (`"use client"`, CVA, `radix-ui`): `ToggleGroup`, `ToggleGroupItem`
- `toggle.tsx` (`"use client"`, CVA, `radix-ui`): `Toggle`, `toggleVariants`
- `tooltip.tsx` (`"use client"`, `radix-ui`): `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`

## Invariants
- **Context-guarded hooks throw outside providers**:
  - `useCarousel` throws `Error("useCarousel must be used within a <Carousel />")` when `CarouselContent`, `CarouselItem`, `CarouselPrevious`, or `CarouselNext` is rendered outside `Carousel` `[carousel.tsx:useCarousel]`.
  - `useChart` throws `Error("useChart must be used within a <ChartContainer />")` when `ChartTooltipContent` or `ChartLegendContent` is rendered outside `ChartContainer` `[chart.tsx:useChart]`.
  - `useFormField` throws `Error("useFormField should be used within <FormField>")` if `FormFieldContext` is missing, and requires both `Form` (`FormProvider`) and `FormItem` ancestors to resolve `react-hook-form` state and derived `formItemId` / `formDescriptionId` / `formMessageId` `[form.tsx:useFormField]`.
  - `useSidebar` throws `Error("useSidebar must be used within a SidebarProvider.")` when `Sidebar`, `SidebarTrigger`, `SidebarRail`, or `SidebarMenuButton` is rendered outside `SidebarProvider` `[sidebar.tsx:useSidebar]`.
- **Automatic portaling & overlay composition**:
  - `AlertDialogContent`, `DialogContent`, `DrawerContent`, and `SheetContent` automatically wrap their content and overlay inside their respective Portal primitives `[alert-dialog.tsx:AlertDialogContent]` `[dialog.tsx:DialogContent]` `[drawer.tsx:DrawerContent]` `[sheet.tsx:SheetContent]`.
  - `ComboboxContent`, `ContextMenuContent`, `DropdownMenuContent`, `HoverCardContent`, `MenubarContent`, `PopoverContent`, `SelectContent`, and `TooltipContent` automatically portal their popup content (while `ContextMenuSubContent`, `DropdownMenuSubContent`, and `MenubarSubContent` render without an automatic portal) `[combobox.tsx:ComboboxContent]` `[context-menu.tsx:ContextMenuContent]` `[context-menu.tsx:ContextMenuSubContent]` `[dropdown-menu.tsx:DropdownMenuContent]` `[dropdown-menu.tsx:DropdownMenuSubContent]` `[hover-card.tsx:HoverCardContent]` `[menubar.tsx:MenubarContent]` `[menubar.tsx:MenubarSubContent]` `[popover.tsx:PopoverContent]` `[select.tsx:SelectContent]` `[tooltip.tsx:TooltipContent]`.
  - `TooltipProvider` (default `delayDuration={0}`) is required as an ancestor for `Tooltip`; `SidebarProvider` embeds `TooltipProvider` with `delayDuration={0}` `[tooltip.tsx:TooltipProvider]` `[sidebar.tsx:SidebarProvider]`.
  - `DialogFooter` with `showCloseButton={true}` renders `DialogPrimitive.Close` and requires a `Dialog` ancestor `[dialog.tsx:DialogFooter]`.
- **`data-slot` & ancestor-group selector coupling**:
  - Components attach `data-slot`, `data-size`, `data-variant`, `data-orientation`, and Tailwind `group/*` / `peer` classes that descendant or sibling styles rely on: e.g., `CardHeader` + `CardAction` `[card.tsx:CardHeader]`, `Avatar` + `AvatarBadge` / `AvatarGroup` `[avatar.tsx:Avatar]`, `AlertDialogContent` + `AlertDialogMedia` `[alert-dialog.tsx:AlertDialogHeader]`, `Field` (`responsive` orientation) + `FieldGroup` (`@container/field-group`) `[field.tsx:Field]`, `FieldTitle` (`data-slot="field-label"`) `[field.tsx:FieldTitle]`, `InputGroup` + `InputGroupInput`/`InputGroupTextarea` (`data-slot="input-group-control"`) `[input-group.tsx:InputGroup]`, `ComboboxEmpty` inside `ComboboxContent` `[combobox.tsx:ComboboxEmpty]`, `NavigationMenuContent` with `viewport={false}` `[navigation-menu.tsx:NavigationMenuContent]`, `Sidebar` peer attributes + `SidebarInset` `[sidebar.tsx:SidebarInset]`, `Tabs` / `TabsList` + `TabsTrigger` `[tabs.tsx:TabsTrigger]`, `Kbd` inside `[data-slot=tooltip-content]` `[kbd.tsx:Kbd]`.
- **Prop, rendering & value contracts**:
  - `Button`, `Badge`, `BreadcrumbLink`, `ButtonGroupText`, `Item`, and sidebar interactive primitives (`SidebarGroupLabel`, `SidebarGroupAction`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuSubButton`) switch to Radix `Slot.Root` when `asChild={true}` `[button.tsx:Button]` `[sidebar.tsx:SidebarMenuButton]`.
  - `ToggleGroupItem` prioritizes group context over item props (`context.variant || variant`, `context.size || size`), so `ToggleGroup` props override individual item props `[toggle-group.tsx:ToggleGroupItem]`.
  - `DirectionProvider` passes `direction ?? dir` to Radix `Direction.DirectionProvider` (`direction` takes precedence) `[direction.tsx:DirectionProvider]`.
  - `ChartConfig` enforces mutually exclusive `color` vs `theme` (`light` | `dark`) per key; `ChartTooltipContent` omits falsy default values (e.g. `0`) via `item.value && (...)` and skips items with `type === "none"` `[chart.tsx:ChartConfig]` `[chart.tsx:ChartTooltipContent]`.
  - `Progress` consumes `value` (0–100 scale, falsy defaults to `0`) strictly for `translateX(-${100 - (value || 0)}%)` on `ProgressPrimitive.Indicator` without forwarding `value` to `ProgressPrimitive.Root` `[progress.tsx:Progress]`.
  - `Slider` derives thumb count from `value` array, else `defaultValue` array, else `[min, max]` (rendering 2 thumbs when neither is passed) `[slider.tsx:Slider]`.
  - `FieldError` deduplicates error entries by `message`, returning `null` when empty, inline text for 1 error, and a `<ul>` inside `role="alert"` for multiple errors `[field.tsx:FieldError]`.
  - `NativeSelect` replaces HTML `<select>`'s numeric `size` prop with `"sm" | "default"` (`data-size`) `[native-select.tsx:NativeSelect]`.
  - `InputOTPSlot` requires numeric `index` to read `OTPInputContext?.slots[index]` `[input-otp.tsx:InputOTPSlot]`.
  - `Carousel` intercepts `ArrowLeft`/`ArrowRight` in `onKeyDownCapture` with `event.preventDefault()` to invoke `scrollPrev`/`scrollNext` `[carousel.tsx:Carousel]`.
  - `Sidebar` renders a Radix `Sheet` drawer (`--sidebar-width: 18rem`) when `useIsMobile()` is true and `collapsible !== "none"` `[sidebar.tsx:Sidebar]`.
  - `SidebarMenuSkeleton` computes a random width (`50%`–`89%`) via `Math.random()` in `useMemo` on mount `[sidebar.tsx:SidebarMenuSkeleton]`.
  - `Toaster` reads `useTheme()` from `next-themes` (defaulting to `"system"`) and binds popover CSS variables `[sonner.tsx:Toaster]`.
  - `ComboboxChipsInput` destructures and discards `children`; `RadioGroupItem` renders only its indicator without `children` `[combobox.tsx:ComboboxChipsInput]` `[radio-group.tsx:RadioGroupItem]`.
  - Wrapper-vs-inner prop targets: `AccordionContent` applies `className` to its inner `div` `[accordion.tsx:AccordionContent]`, `CommandInput` applies `className`/props to `CommandPrimitive.Input` rather than its wrapper `div` `[command.tsx:CommandInput]`, `Table` applies `className`/props to the inner `<table>` inside an overflow container `div` `[table.tsx:Table]`, and `NativeSelect` forwards `className`/props to the inner `<select>` `[native-select.tsx:NativeSelect]`.

## Side Effects
- **Cookie persistence**: `SidebarProvider` writes `document.cookie = "sidebar_state=<boolean>; path=/; max-age=604800"` whenever desktop sidebar open state changes `[sidebar.tsx:SidebarProvider]`.
- **Global keyboard listener**: `SidebarProvider` registers a `window` `keydown` listener (cleaned up on unmount) that intercepts `Cmd/Ctrl + b`, calls `event.preventDefault()`, and toggles the sidebar `[sidebar.tsx:SidebarProvider]`.
- **Dynamic `<style>` injection**: `ChartStyle` injects an inline `<style>` tag via `dangerouslySetInnerHTML` defining `--color-<key>` CSS custom properties scoped to `[data-chart=<id>]` and `.dark [data-chart=<id>]` `[chart.tsx:ChartStyle]`.
- **Imperative DOM focus**:
  - `InputGroupAddon` queries and focuses `e.currentTarget.parentElement?.querySelector("input")?.focus()` on click or `Enter`/`Space` keydown when the event target is not inside a `<button>` `[input-group.tsx:InputGroupAddon]`.
  - `CalendarDayButton` invokes `ref.current?.focus()` in `useEffect` whenever `modifiers.focused` becomes truthy `[calendar.tsx:CalendarDayButton]`.
- **External carousel API subscription**: `Carousel` calls `setApi(api)` and subscribes to Embla `"reInit"` and `"select"` events (`api.on(...)` with `api?.off("select", onSelect)` cleanup) inside `useEffect` `[carousel.tsx:Carousel]`.

## Verification
- Run: `pnpm lint && pnpm build`
