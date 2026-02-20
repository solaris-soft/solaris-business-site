---
title: Article 2
slug: article-2
description: "This is another article, with a different tag. "
author: Sam
publishDate: 2026-02-19
draft: false
tags:
  - new-tag
---
# The Illusion of High Availability: Why Your System Isn’t as Resilient as You Think

High Availability (HA) is sold as a checkbox. Two nodes? Tick. Load balancer? Tick. Multi-AZ deployment? Tick.

System resilient? Not even close.

Modern systems fail less because of hardware and more because of coordination. The weak link is not redundancy — it’s distributed decision-making under partial failure. That’s where most “highly available” systems quietly collapse.

This article explores the real problem: availability is a property of behaviour under uncertainty, not infrastructure.

⸻

1\. Redundancy Is Easy. Consensus Is Hard.

You can spin up ten replicas of a service in minutes. That doesn’t make your system available. It makes it duplicated.

Availability breaks when nodes must agree.

Consider:

• Leader election

• Distributed locks

• Transaction ordering

• Cache invalidation

• Schema migrations

These are coordination problems. And coordination under network partitions is brutal.

The classic theorem governing this space is:

• CAP theorem

You cannot simultaneously guarantee Consistency, Availability, and Partition tolerance.

Since partitions are inevitable in real systems, you must trade off between consistency and availability. Most teams believe they’ve chosen availability — until they hit a split-brain scenario and discover they actually chose neither.

⸻

2\. The Silent Killer: Partial Failure

Total failure is obvious. Partial failure is catastrophic.

In distributed systems:

• Some nodes respond.

• Some are slow.

• Some drop packets.

• Some return stale data.

Your system is “up”. But behaviour is undefined.

The most common HA failure pattern looks like this:

1\. Node A can see Node B.

2\. Node B cannot see Node A.

3\. Both believe they are healthy.

4\. Both accept writes.

5\. Data diverges.

6\. Reconciliation becomes destructive.

This is not hypothetical. It is routine.

Systems like:

• Apache ZooKeeper

• etcd

• Consul

exist specifically to manage consensus and prevent this class of failure.

Yet many systems layer HA infrastructure on top of non-HA assumptions — e.g., single-writer databases hidden behind “smart” proxies.

⸻

3\. High Availability vs High Reliability

These are not the same.

High Availability: The system responds to requests.

High Reliability: The system behaves correctly.

You can return HTTP 200 with corrupted state. That’s available, not reliable.

The uncomfortable truth: most production systems optimise for uptime metrics rather than behavioural guarantees.

SLAs encourage this. If your uptime target is 99.9%, returning degraded responses may technically satisfy it — even if your data is wrong.

⸻

4\. The Hidden Cost of Eventual Consistency

Eventual consistency is attractive. It scales. It tolerates partitions.

But it pushes complexity to the application layer.

You now need to reason about:

• Write conflicts

• Causal ordering

• Idempotency

• Read repair

• Convergence strategies

Distributed databases such as:

• Apache Cassandra

• Amazon DynamoDB

make deliberate trade-offs here.

The engineering cost shifts from infrastructure to product logic.

And here’s the problem: application engineers rarely model distributed state formally. They assume “rare conflict”. At scale, rare becomes constant.

⸻

5\. HA and the Compute Illusion

Cloud platforms create an illusion of infinite compute:

• Auto-scaling groups

• Managed load balancers

• Cross-region replication

• “Five nines” marketing

But compute elasticity does not solve coordination limits.

Even with infinite nodes:

• You still need quorum.

• You still need write ordering.

• You still need a source of truth.

And quorum math is unforgiving.

In a 3-node cluster:

• Lose 1 node → healthy.

• Lose 2 nodes → dead.

Scaling to 5 nodes improves fault tolerance — but increases coordination overhead and latency. Availability is not free; it increases complexity quadratically with interaction paths.

⸻

6\. Observability Is the Real HA Primitive

The most underappreciated HA tool is observability.

You cannot fix what you cannot see.

Modern systems rely heavily on:

• Distributed tracing

• Structured logs

• High-cardinality metrics

Without these, partial failures masquerade as performance issues.

Tools like:

• Prometheus

• Jaeger

help surface coordination anomalies — but only if teams understand what to look for: leader churn, increasing replication lag, quorum instability.

True HA begins with making coordination failure observable.

⸻

7\. The Future: Designing for Degradation, Not Survival

Most HA design assumes binary states: up or down.

The future is graceful degradation.

Instead of asking:

“How do we prevent failure?”

Ask:

“What minimal guarantees can we preserve during failure?”

Examples:

• Read-only mode during leader loss.

• Write queue buffering during quorum instability.

• Stale-but-bounded reads during replication lag.

• Feature flag–driven capability shedding.

Systems should degrade like aircraft — shedding non-critical functionality to preserve core control.

That requires explicit modelling of system invariants, not infrastructure duplication.

⸻

8\. The Real Definition of High Availability

High Availability is not:

• Multi-region deployment

• Redundant nodes

• A managed database

High Availability is:

The system continues to uphold its most important invariants under uncertainty.

That is a computational property, not a DevOps configuration.

And it demands:

• Careful consensus selection

• Explicit failure modelling

• Application-level conflict strategies

• Observability-driven design

• Controlled degradation paths

Infrastructure can support this.

It cannot substitute for it.

⸻

If your HA strategy is primarily architectural diagrams with duplicated boxes, you don’t have high availability.

You have symmetry.

And symmetry fails spectacularly under asymmetry — which is exactly how real systems break.