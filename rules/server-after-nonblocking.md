---
title: Use event.waitUntil for Non-Blocking Operations
impact: HIGH
impactDescription: improves response time by deferring background work
tags: server, nuxt, async, background-tasks, waitUntil
---

## Use event.waitUntil for Non-Blocking Operations

Use `event.waitUntil()` to run background tasks (logging, analytics, cache warming) after the response is sent, without blocking the user.

**Incorrect (blocks response for slow operations):**

```typescript
// server/api/order.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Create order (fast)
  const order = await db.order.create({ data: body })

  // Send confirmation email (slow: 2-3 seconds)
  await sendEmail({
    to: body.email,
    subject: 'Order Confirmation',
    template: 'order-confirmation',
    data: order
  })

  // Log analytics (slow: 500ms)
  await logAnalytics('order_created', order)

  // Warm cache (slow: 1 second)
  await warmUserCache(body.userId)

  // User waits 3.5+ seconds for response!
  return { success: true, order }
})
```

**Correct (immediate response, background work):**

```typescript
// server/api/order.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Create order (fast)
  const order = await db.order.create({ data: body })

  // Schedule background tasks (non-blocking)
  event.waitUntil((async () => {
    // Send email in background
    await sendEmail({
      to: body.email,
      subject: 'Order Confirmation',
      template: 'order-confirmation',
      data: order
    })

    // Log analytics in background
    await logAnalytics('order_created', order)

    // Warm cache in background
    await warmUserCache(body.userId)
  })())

  // Return immediately! User sees response in ~100ms
  return { success: true, order }
})
```

**Multiple background tasks:**

```typescript
// server/api/signup.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Critical: create user account
  const user = await db.user.create({ data: body })

  // Non-blocking: welcome email
  event.waitUntil(
    sendWelcomeEmail(user.email)
  )

  // Non-blocking: setup default settings
  event.waitUntil(
    createDefaultUserSettings(user.id)
  )

  // Non-blocking: log to analytics
  event.waitUntil(
    trackUserSignup(user.id)
  )

  // Non-blocking: trigger webhooks
  event.waitUntil(
    notifyWebhooks('user.created', user)
  )

  return { success: true, userId: user.id }
})
```

**Background cache warming:**

```typescript
// server/api/product/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  // Fetch requested product
  const product = await db.product.findUnique({
    where: { id }
  })

  // Warm related products cache in background
  event.waitUntil((async () => {
    const related = await db.product.findMany({
      where: { categoryId: product.categoryId },
      take: 10
    })
    await cacheRelatedProducts(product.id, related)
  })())

  return product
})
```

**Error handling in background tasks:**

```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = await processData(body)

  // Handle errors in background tasks
  event.waitUntil((async () => {
    try {
      await sendNotification(result)
      await logAnalytics(result)
    } catch (error) {
      // Log error but don't fail the response
      console.error('Background task failed:', error)
      await logError(error)
    }
  })())

  return result
})
```

**Impact Analysis:**
- Performance gain: 2-10× faster response times by deferring non-critical work
- Use cases: Email sending, analytics, logging, cache warming, webhook notifications
- Considerations: Background tasks run even if user closes the connection

Reference: [Nuxt Server Directory](https://nuxt.com/docs/guide/directory-structure/server)
