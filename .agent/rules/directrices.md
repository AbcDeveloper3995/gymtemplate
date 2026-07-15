# Directrices Globales Frontend

## Estándares de Desarrollo para Proyectos React + Tailwind CSS

### Documento Base para Agente Antigravity

**Versión:** 3.0  
**Fecha:** Junio 2026

\---

# 0\. USO OBLIGATORIO DE SKILLS INSTALADAS

> \\\*\\\*Regla absoluta:\\\*\\\* Antes de generar cualquier código, crear cualquier archivo o ejecutar cualquier comando, el agente Antigravity \\\*\\\*DEBE\\\*\\\* consultar las skills instaladas relevantes para la tarea.



## Flujo obligatorio antes de generar código

```
1. Identificar qué tipo de output se va a producir
2. Consultar TODAS las skills relevantes (puede haber más de una)
3. Derivar decisiones técnicas de lo que dice la skill, no de memoria
4. Solo entonces escribir el código
```

**Nunca asumir que ya se sabe lo que dice una skill. Leerla siempre.**

\---

# 1\. Objetivo

Definir reglas globales, estándares técnicos y patrones concretos y accionables aplicables a TODOS los proyectos frontend del agente Antigravity.

Estas directrices son **obligatorias** para:

* Generación de código
* Arquitectura frontend
* Organización del proyecto
* Decisiones de diseño visual
* Escalabilidad y mantenibilidad

\---

# 2\. Stack Tecnológico

## 2.1 Core obligatorio

|Tecnología|Rol|Versión mínima|
|-|-|-|
|**React**|Framework principal|18+|
|**JavaScript ES6**|Lenguaje principal||
|**Vite**|Build tool / Dev server|5+|
|**Tailwind CSS v4**|Styling principal|4+|
|**React Router v7**|Routing|7+|

> \\\*\\\*Por qué Tailwind sobre Material UI:\\\*\\\* MUI impone un design system cerrado que limita la identidad visual de cada proyecto. Tailwind permite construir UIs distintivas y a medida sin sobrescribir estilos del sistema, con mejor performance (sin runtime CSS-in-JS) y mayor control sobre el output final.

## 2.2 Estado y datos

|Librería|Rol|
|-|-|
|**Zustand**|Estado global de UI y negocio|
|**TanStack Query v5**|Estado servidor, caché, sincronización|
|**Axios**|Cliente HTTP (envuelto en servicios, nunca directo)|

## 2.3 Formularios y validación

|Librería|Rol|
|-|-|
|**React Hook Form**|Gestión de formularios|
|**Zod**|Esquemas de validación y tipado de datos|

## 2.4 UI y componentes

|Librería|Rol|
|-|-|
|**shadcn/ui**|Componentes base accesibles (Radix UI bajo el capó)|
|**Lucide React**|Iconografía|
|**Framer Motion**|Animaciones e interacciones|
|**clsx + tailwind-merge**|Composición de clases condicional|

## 2.5 Calidad de código

|Herramienta|Rol|
|-|-|
|**ESLint**|Linting (con plugin react, hooks, typescript)|
|**Prettier**|Formateo automático|
|**Husky + lint-staged**|Hooks pre-commit|
|**Vitest**|Testing unitario|
|**React Testing Library**|Testing de componentes|

\---

# 3\. Arquitectura del Proyecto

## 3.1 Estructura de carpetas

```
src/
├── app/                    # Configuración raíz: providers, router, store global
│   ├── App.tsx
│   ├── providers.tsx       # Todos los providers anidados aquí
│   └── router.tsx
│
├── components/             # Componentes verdaderamente genéricos y reutilizables
│   ├── ui/                 # Wrappers sobre shadcn/ui + primitivos propios
│   └── layouts/            # Shell layouts (MainLayout, AuthLayout, etc.)
│
├── modules/                # Cada feature del negocio es un módulo aislado
│   └── \\\[feature]/
│       ├── components/     # UI específica de esta feature
│       ├── hooks/          # Lógica y datos de esta feature
│       ├── services/       # Llamadas API de esta feature
│       ├── store/          # Estado Zustand de esta feature
│       ├── types/          # Tipos e interfaces de esta feature
│       ├── validations/    # Esquemas Zod de esta feature
│       └── utils/          # Helpers específicos de esta feature
│
├── pages/                  # Componentes de página (solo ensamblan módulos)
│
├── hooks/                  # Hooks globales reutilizables entre features
├── services/               # Servicios HTTP base (cliente axios, interceptores)
├── store/                  # Estado global compartido entre features
├── types/                  # Tipos globales compartidos
├── utils/                  # Utilidades globales
├── constants/              # Constantes de la aplicación
├── styles/                 # Tailwind config, variables CSS globales
└── assets/                 # Imágenes, fuentes, SVGs
```

## 3.2 Módulo de feature — estructura canónica

Cada feature sigue esta estructura sin excepción:

```
modules/bookings/
├── components/
│   ├── BookingCard.tsx
│   ├── BookingForm.tsx
│   └── BookingList.tsx
├── hooks/
│   ├── useBookings.ts        # Datos via TanStack Query
│   └── useBookingForm.ts     # Lógica de formulario
├── services/
│   └── bookings.service.ts   # Todas las llamadas API de esta feature
├── store/
│   └── bookings.store.ts     # Estado Zustand si aplica
├── types/
│   └── booking.types.ts      # Interfaces y tipos
├── validations/
│   └── booking.schema.ts     # Esquemas Zod
└── utils/
    └── booking.utils.ts      # Helpers y transformaciones
```

\---

# 4\. Patrones de Código — Ejemplos Canónicos

> Estos ejemplos son la referencia obligatoria. Toda generación de código debe seguir estos patrones.

## 4.1 Componente — patrón correcto

```tsx
// modules/bookings/components/BookingCard.tsx
import { type FC } from 'react'
import { cn } from '@/utils/cn'
import type { Booking } from '../types/booking.types'

interface BookingCardProps {
  booking: Booking
  isSelected?: boolean
  onSelect: (id: string) => void
}

// Componente de tarjeta de reserva. Una responsabilidad: renderizar
// los datos de una reserva y emitir el evento de selección.
const BookingCard: FC<BookingCardProps> = ({ booking, isSelected = false, onSelect }) => {
  const handleSelect = () => onSelect(booking.id)

  return (
    <article
      className={cn(
        'rounded-xl border p-4 transition-shadow cursor-pointer',
        'hover:shadow-md',
        isSelected \\\&\\\& 'border-blue-500 ring-2 ring-blue-200'
      )}
      onClick={handleSelect}
      aria-selected={isSelected}
    >
      <h3 className="font-semibold text-gray-900">{booking.title}</h3>
      <p className="text-sm text-gray-500 mt-1">{booking.date}</p>
    </article>
  )
}

export default BookingCard
```

**Reglas derivadas de este ejemplo:**

* Máximo \~80 líneas por componente. Si crece, dividir.
* Props tipadas con una interface local explícita.
* `cn()` para clases condicionales (nunca template literals para eso).
* Eventos nombrados `onX`, handlers internos nombrados `handleX`.
* HTML semántico (`article`, `section`, `nav`, etc.), nunca solo `div`.
* Default exports para componentes, named exports para utils y tipos.

## 4.2 Hook de datos — patrón correcto

```ts
// modules/bookings/hooks/useBookings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsService } from '../services/bookings.service'
import type { CreateBookingDto } from '../types/booking.types'

// Claves de caché centralizadas para evitar strings sueltos
const BOOKINGS\\\_QUERY\\\_KEY = \\\['bookings'] as const

/\\\*\\\*
 \\\* Hook principal de bookings. Expone datos, estados y mutaciones.
 \\\* Los componentes no deben importar bookingsService directamente.
 \\\*/
export function useBookings() {
  const queryClient = useQueryClient()

  const {
    data: bookings = \\\[],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: BOOKINGS\\\_QUERY\\\_KEY,
    queryFn: bookingsService.getAll,
    staleTime: 1000 \\\* 60 \\\* 5, // 5 minutos
  })

  const createMutation = useMutation({
    mutationFn: (dto: CreateBookingDto) => bookingsService.create(dto),
    onSuccess: () => {
      // Invalidar caché para refetch automático tras crear
      queryClient.invalidateQueries({ queryKey: BOOKINGS\\\_QUERY\\\_KEY })
    },
  })

  return {
    bookings,
    isLoading,
    isError,
    error,
    createBooking: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  }
}
```

**Reglas derivadas:**

* Un hook = un propósito claro.
* Los query keys siempre como constantes, nunca strings inline.
* `staleTime` siempre explícito, nunca dejar el default sin decisión consciente.
* Los componentes solo consumen el hook, nunca el service directamente.

## 4.3 Service — patrón correcto

```ts
// modules/bookings/services/bookings.service.ts
import { apiClient } from '@/services/api.client'
import type { Booking, CreateBookingDto } from '../types/booking.types'

// Toda comunicación con el servidor de bookings vive aquí.
// Los hooks consumen estos métodos, nunca axios directamente.
export const bookingsService = {
  getAll: (): Promise<Booking\\\[]> =>
    apiClient.get('/bookings').then(res => res.data),

  getById: (id: string): Promise<Booking> =>
    apiClient.get(`/bookings/${id}`).then(res => res.data),

  create: (dto: CreateBookingDto): Promise<Booking> =>
    apiClient.post('/bookings', dto).then(res => res.data),

  update: (id: string, dto: Partial<CreateBookingDto>): Promise<Booking> =>
    apiClient.patch(`/bookings/${id}`, dto).then(res => res.data),

  remove: (id: string): Promise<void> =>
    apiClient.delete(`/bookings/${id}`),
}
```

## 4.4 Esquema de validación Zod — patrón correcto

```ts
// modules/bookings/validations/booking.schema.ts
import { z } from 'zod'

export const createBookingSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede superar 100 caracteres'),
  date: z
    .string()
    .datetime({ message: 'Formato de fecha inválido' }),
  guestCount: z
    .number()
    .int()
    .min(1, 'Debe haber al menos 1 persona')
    .max(50, 'Máximo 50 personas por reserva'),
})

// El tipo se deriva del schema, nunca se define por separado
export type CreateBookingDto = z.infer<typeof createBookingSchema>
```

## 4.5 Formulario — patrón correcto

```tsx
// modules/bookings/components/BookingForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBookingSchema, type CreateBookingDto } from '../validations/booking.schema'
import { useBookings } from '../hooks/useBookings'

const BookingForm = () => {
  const { createBooking, isCreating } = useBookings()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBookingDto>({
    resolver: zodResolver(createBookingSchema),
  })

  const onSubmit = async (data: CreateBookingDto) => {
    try {
      await createBooking(data)
      reset()
    } catch (error) {
      // Los errores de red ya son manejados por el interceptor global.
      // Aquí solo manejamos errores de UX específicos de este formulario.
      console.error('\\\[BookingForm] Error al crear reserva:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          id="title"
          {...register('title')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {errors.title \\\&\\\& (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isCreating}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
      >
        {isCreating ? 'Creando...' : 'Crear reserva'}
      </button>
    </form>
  )
}

export default BookingForm
```

## 4.6 Store Zustand — patrón correcto

```ts
// modules/bookings/store/bookings.store.ts
import { create } from 'zustand'
import type { Booking } from '../types/booking.types'

interface BookingsUIState {
  selectedBookingId: string | null
  isDrawerOpen: boolean
  // Acciones siempre dentro del mismo store
  selectBooking: (id: string | null) => void
  toggleDrawer: () => void
}

// Solo estado de UI aquí. El estado del servidor vive en TanStack Query.
export const useBookingsStore = create<BookingsUIState>((set) => ({
  selectedBookingId: null,
  isDrawerOpen: false,

  selectBooking: (id) => set({ selectedBookingId: id }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
}))
```

\---

# 5\. Styling con Tailwind CSS

## 5.1 Utilidad `cn` — obligatoria

Siempre usar `clsx` + `tailwind-merge` para clases condicionales:

```ts
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue\\\[]) {
  return twMerge(clsx(inputs))
}
```

## 5.2 Design tokens — config Tailwind

Todos los valores visuales del proyecto deben estar en `tailwind.config.ts`. Nunca hardcodear colores o tamaños en clases arbitrarias `\\\[#fff]` salvo casos excepcionales documentados.

```ts
// tailwind.config.ts
export default {
  content: \\\['./src/\\\*\\\*/\\\*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: \\\['Inter', 'sans-serif'],
        display: \\\['Cal Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
}
```

## 5.3 Variantes de componentes — patrón CVA

Para componentes con múltiples variantes visuales, usar `class-variance-authority`:

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  // Base siempre presente
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50',
  {
    variants: {
      variant: {
        default:  'bg-brand-500 text-white hover:bg-brand-600',
        outline:  'border border-gray-300 bg-white hover:bg-gray-50',
        ghost:    'hover:bg-gray-100',
        danger:   'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm:  'h-8 px-3',
        md:  'h-10 px-4',
        lg:  'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = ({ className, variant, size, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
)

export { Button, buttonVariants }
```

\---

# 6\. Tipos — Reglas Obligatorias

```ts
// modules/bookings/types/booking.types.ts

// Las interfaces modelan entidades del dominio
export interface Booking {
  id: string
  title: string
  date: string
  guestCount: number
  status: BookingStatus
  createdAt: string
}

// Los enums se definen como const objects para mejor tree-shaking
export const BookingStatus = {
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const

export type BookingStatus = typeof BookingStatus\\\[keyof typeof BookingStatus]
```

**Reglas:**

* `type` para uniones, intersecciones y aliases simples.
* `interface` para entidades y props de componentes.
* Nunca `any`. Si hay incertidumbre, usar `unknown` y narrowing.
* Los tipos se derivan de los schemas Zod cuando aplica (`z.infer<>`).
* Nunca duplicar un tipo: si ya existe en Zod, no crear una interface aparte.

\---

# 7\. Manejo de Estados y Errores

## 7.1 Todo flujo debe manejar los 4 estados

```tsx
const BookingList = () => {
  const { bookings, isLoading, isError, error } = useBookings()

  // Estado: cargando
  if (isLoading) return <BookingListSkeleton />

  // Estado: error
  if (isError) return <ErrorMessage message={error?.message} onRetry={() => {}} />

  // Estado: vacío
  if (bookings.length === 0) return <EmptyState message="No hay reservas aún." />

  // Estado: éxito
  return (
    <ul className="space-y-3">
      {bookings.map(booking => (
        <li key={booking.id}>
          <BookingCard booking={booking} onSelect={() => {}} />
        </li>
      ))}
    </ul>
  )
}
```

## 7.2 Cliente HTTP base con interceptores

```ts
// services/api.client.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE\\\_API\\\_URL,
  timeout: 10\\\_000,
  headers: { 'Content-Type': 'application/json' },
})

// Inyección de token de autenticación
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth\\\_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Manejo centralizado de errores HTTP
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login, limpiar sesión
      window.location.href = '/login'
    }
    // Normalizar mensaje de error para consumo en la UI
    const message = error.response?.data?.message ?? 'Error inesperado del servidor'
    return Promise.reject(new Error(message))
  }
)
```

\---

# 8\. Diseño Visual — Integración con Skill frontend-design

> \\\*\\\*Obligatorio:\\\*\\\* Antes de tomar cualquier decisión de diseño (paleta, tipografía, layout, animaciones), el agente \\\*\\\*debe\\\*\\\* leer la skill `frontend-design` en `/mnt/skills/public/frontend-design/SKILL.md`.

## 8.1 Principios que derivan de la skill

* **Cada proyecto debe tener identidad visual propia.** Tailwind es el habilitador, no el diseño. Evitar el look genérico "Tailwind gris con azul".
* **Brainstorm antes de codificar.** Definir paleta (4–6 colores con hex), tipografía (display + body) y layout concept antes de escribir JSX.
* **El hero es una tesis.** La primera pantalla debe comunicar la propuesta de valor del producto, no ser un placeholder.
* **Animaciones con Framer Motion solo donde añaden significado.** No decorativas.
* **Responsive siempre.** Mobile-first, sin overflows, con breakpoints de Tailwind (`sm`, `md`, `lg`, `xl`).
* **Accesibilidad no negociable.** Focus visible, contraste WCAG AA, labels en todos los inputs, HTML semántico.

## 8.2 Tokens de diseño mínimos por proyecto

Cada proyecto debe definir antes de arrancar:

```
Paleta:
  - primary:     #\\\_\\\_\\\_\\\_\\\_\\\_  (acción principal)
  - secondary:   #\\\_\\\_\\\_\\\_\\\_\\\_  (acento)
  - surface:     #\\\_\\\_\\\_\\\_\\\_\\\_  (fondos de tarjetas)
  - background:  #\\\_\\\_\\\_\\\_\\\_\\\_  (fondo base)
  - text:        #\\\_\\\_\\\_\\\_\\\_\\\_  (texto principal)
  - muted:       #\\\_\\\_\\\_\\\_\\\_\\\_  (texto secundario)

Tipografía:
  - display:  \\\[fuente para headings]
  - body:     \\\[fuente para texto corrido]
  - mono:     \\\[fuente para código si aplica]

Espaciado base: \\\[4px / 8px system]
Border radius base: \\\[px o rem]
```

\---

# 9\. Convenciones de Nombrado

|Elemento|Convención|Ejemplo|
|-|-|-|
|Componentes|PascalCase|`BookingCard.tsx`|
|Hooks|camelCase con prefijo `use`|`useBookings.ts`|
|Servicios|camelCase con sufijo `.service`|`bookings.service.ts`|
|Stores|camelCase con sufijo `.store`|`bookings.store.ts`|
|Tipos|PascalCase con sufijo `Types`|`booking.types.ts`|
|Schemas Zod|camelCase con sufijo `.schema`|`booking.schema.ts`|
|Variables|camelCase|`selectedBookingId`|
|Constantes|UPPER\_SNAKE\_CASE|`MAX\\\_GUEST\\\_COUNT`|
|Eventos props|prefijo `on`|`onSelect`, `onChange`|
|Handlers internos|prefijo `handle`|`handleSelect`|
|Archivos de utils|camelCase|`cn.ts`, `date.utils.ts`|
|Páginas|PascalCase con sufijo `Page`|`BookingsPage.tsx`|

\---

# 10\. Reglas de Límites

Estas son métricas concretas para mantener el código manejable:

|Elemento|Límite máximo|
|-|-|
|Líneas por componente|100|
|Líneas por hook|80|
|Líneas por función|30|
|Props por componente|8|
|Profundidad de JSX anidado|4 niveles|
|Archivos por carpeta de módulo|10|

Si se supera algún límite: dividir, extraer, abstraer.

\---

# 11\. Reglas Absolutas

## SIEMPRE

* Leer la skill relevante antes de generar código
* Usar React + JavaScript + Tailwind CSS
* Tipar todas las props, funciones y respuestas de API
* Manejar los 4 estados: loading, error, empty, success
* HTML semántico
* Comentar lógica compleja, reglas de negocio y workarounds
* Derivar tipos de schemas Zod cuando exista el schema
* Un componente, un propósito

## NUNCA

* Hardcodear colores o valores fuera del config de Tailwind
* Llamar a axios o fetch directamente desde un componente
* Crear componentes mayores a 100 líneas sin dividir
* Duplicar lógica entre módulos (extraer a `hooks/` o `utils/` globales)
* Ignorar estados de error o loading
* Mezclar lógica de negocio con JSX
* Crear tipos duplicados cuando ya existe un schema Zod
* Usar `!important` en estilos
* Hardcodear strings de URLs de API (usar `import.meta.env`)

\---

# 12\. Resultado Esperado

Todo código generado por el agente Antigravity debe producir aplicaciones:

* **Visualmente distintivas** — no genéricas, con identidad propia por proyecto
* **Técnicamente sólidas** — tipadas, modularizadas, sin `any`
* **Robustas** — todos los estados manejados, errores contemplados
* **Mantenibles** — cualquier desarrollador puede entender el código sin explicación externa
* **Escalables** — agregar una feature no rompe las existentes
* **Accesibles** — navegables por teclado, con contraste correcto, semánticas
* **Performantes** — lazy loading, sin rerenders innecesarios, caché inteligente

