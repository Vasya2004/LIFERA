# LIFERA 2.0 — iOS

SwiftUI-приложение поверх той же базы Supabase, что и `apps/web`. Схема данных и
RLS-политики — общие (`supabase/migrations`), UI пока минимальный: вход,
регистрация, список областей жизни, записи внутри области.

## Запуск

1. Установи [XcodeGen](https://github.com/yonaskolb/XcodeGen), если его ещё нет:
   ```bash
   brew install xcodegen
   ```
2. Сгенерируй Xcode-проект (`.xcodeproj` не хранится в git — источник правды
   это `project.yml`):
   ```bash
   xcodegen generate
   ```
3. Открой `Lifera2.xcodeproj` в Xcode и запусти на симуляторе.

При первой сборке Xcode подтянет Swift-пакет `supabase-swift` через SPM —
нужен интернет.

## Что не реализовано

- Кастомные поля (`custom_fields` / `item_field_values`) — есть в вебе
  (`apps/web/src/app/areas/[id]/page.tsx`), в iOS ещё нет.
- Редактирование/удаление записей и областей.
- Оффлайн-режим и кеширование.
