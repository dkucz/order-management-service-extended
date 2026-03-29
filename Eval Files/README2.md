# Evaluation Design

## 1. Overview

We evaluate the context graph as a **retrieval system for software development workflows**, not as a vague end-to-end agent benchmark. The benchmark therefore begins by defining the capabilities we want to measure, and then constructs synthetic datasets and questions specifically to test those capabilities.

This follows a common pattern in recent evaluation work: tasks are defined first, and datasets are generated to isolate and measure those tasks under controlled conditions.

Our benchmark is therefore organized around a simple principle:

> **Define the software-development memory capability first, then generate synthetic repositories, conversations, and questions that isolate that capability.**

This makes the benchmark easier to justify, easier to control, and easier to interpret.

---

## 2. Benchmark Goals

The benchmark is designed to answer four questions:

1. **What kind of developer-memory task is being tested?**
2. **What repository and artifact structure is needed to test that task?**
3. **Does graph-based retrieval improve answer quality over simpler retrieval methods?**
4. **Does it do so with lower context cost and acceptable latency?**

Accordingly, each benchmark instance is evaluated under multiple retrieval settings, compared against deterministic ground truth where possible, and measured on both effectiveness and efficiency.

---

## 3. Task Taxonomy

The benchmark is divided into explicit capability categories rather than a single pool of questions. Each category corresponds to a type of developer-memory task that arises in real workflows.

### 3.1 Information Extraction

**Definition.** Retrieve a single fact explicitly stated in one artifact.

**Why it matters.** Developers frequently need precise details such as headers, endpoints, configuration keys, or payload formats.

**Dataset construction.** The answer is fully contained in one document, file, or artifact.

**Example question.**
> What header is required for authentication on the orders endpoint?

---

### 3.2 Multi-hop Retrieval

**Definition.** Combine information distributed across multiple artifacts.

**Why it matters.** Relevant information is often split across files, docs, and conversations.

**Dataset construction.** The answer is intentionally distributed across multiple artifacts and requires combining them.

**Example question.**
> What authentication is required when calling a paginated orders endpoint?

---

### 3.3 Knowledge Update

**Definition.** Determine what information is currently valid after a change over time.

**Why it matters.** Software systems evolve. Correct behavior depends on distinguishing current from outdated information.

**Dataset construction.** Synthetic repositories include multiple versions, where later changes may override or contradict earlier ones.

**Example question.**
> Which commit introduced the webhook bug, and what was the previous correct behavior?

---

### 3.4 Temporal Reasoning

**Definition.** Reason about the order and validity of events or states over time.

**Why it matters.** Developers need to understand not just what is true, but when it became true.

**Dataset construction.** Benchmark instances include timelines of changes, messages, and updates.

**Example question.**
> After the pagination change, which error-handling rule was still valid at the time the failure occurred?

---

### 3.5 Debugging and Provenance

**Definition.** Explain system behavior by linking outputs back to earlier artifacts.

**Why it matters.** Many developer tasks involve tracing cause-and-effect relationships across code and context.

**Dataset construction.** Answers require traversing chains such as task → discussion → code change → failure.

**Example question.**
> Why does the current webhook handler reject valid events?

---

## 4. Benchmark Instance Structure

Each benchmark instance is a **structured synthetic scenario**, not just a prompt-answer pair.

A typical instance includes:

1. Initial repository state  
2. Task or issue description  
3. One or more updates that modify or contradict earlier information  
4. Optional repository changes (e.g. commits or file edits)  
5. A question set targeting one or more task categories  
6. Ground-truth annotations  

This structure supports both static retrieval and temporal reasoning within the same framework.

---

## 5. Dataset Strategy

### 5.1 Synthetic Data as the Primary Benchmark

The benchmark is built primarily using **synthetic repositories, documents, and conversations**, while optionally incorporating a real-world repository for generalization testing.

This is intentional and necessary:

- It ensures precise control over ground truth  
- It allows direct targeting of specific task categories  
- It avoids ambiguity present in real-world repositories  
- It enables reproducible evaluation  

---

### 5.2 Why Synthetic Data Is Required

Synthetic generation allows us to control:

- which capability is being tested  
- how information is distributed  
- when knowledge changes  
- where noise is introduced  
- how difficult retrieval should be  

This level of control is not possible with real repositories.

Each synthetic benchmark instance is constructed to test one or more task categories defined in Section 3, ensuring that dataset design directly follows from the evaluation objectives.

---

### 5.3 Real-World Data for Generalization

After the synthetic benchmark is established, real-world repositories can be used to evaluate **generalization**.

The goal of this phase is not to provide precise, deterministic evaluation, but to answer questions such as:

- Can the system scale to larger repositories?
- Does it handle more realistic code organization and naming?
- Does retrieval remain effective when structure is less controlled?

This complements the synthetic benchmark by introducing:

- less predictable structure  
- implicit relationships between artifacts  
- additional noise and ambiguity  

Unlike synthetic data, real repositories do not provide clean ground truth or clearly defined task boundaries. As a result, evaluation on real-world data should be interpreted as **qualitative validation** rather than a primary benchmark.

The overall evaluation strategy is therefore:

- **Synthetic benchmark:** controlled, task-driven, and used for quantitative comparison  
- **Real-world repositories:** used to test robustness and generalization to realistic developer contexts  
---

## 6. Corpus Design and Scale

The benchmark should not remain a minimal toy setup. Retrieval difficulty depends strongly on context size and noise.

### 6.1 Recommended Context Tiers

#### Small
- 10–20 artifacts  
- mostly single-hop and simple multi-hop  
- used for debugging the benchmark  

#### Medium
- 25–75 artifacts  
- multiple files, docs, and conversations  
- sufficient noise to weaken naive retrieval  

#### Large
- 100+ artifacts  
- long multi-step timelines  
- designed for knowledge-update and temporal reasoning  

---

### 6.2 Artifact Types

Artifacts can include:

- source files  
- documentation  
- commit messages

This reflects real developer context rather than a single document type.

---

## 7. Question Design

Questions must be derived from the task taxonomy.

### 7.1 Deterministic Questions

Used when a precise answer exists.

Best suited for:
- information extraction  
- many multi-hop tasks  
- current-state knowledge  

---

### 7.2 Open-Ended Questions

Used for:
- debugging  
- provenance  
- causal explanations  

These require evaluation with an LLM judge, using explicit criteria.

---

### 7.3 Task-to-Question Mapping

Each question should specify:

- task category  
- required supporting artifacts  
- whether the answer is exact or open-ended  
- whether temporal reasoning is required  

This ensures questions are systematically constructed rather than intuitive.

---

## 8. Evaluation Conditions

Each question is evaluated under multiple retrieval settings:

- **No Retrieval**: baseline without context  
- **Embedding Retrieval**: similarity-based retrieval  
- **Graph Retrieval**: structured retrieval using relationships  

This isolates the contribution of graph-based methods.

---

## 9. Metrics

### Retrieval Metrics
- Artifact Hit Rate  
- Top-k Coverage  

### Answer Metrics
- Fact Hit Rate  
- Temporal Correctness  
- Groundedness  

### Efficiency Metrics
- Context tokens  
- Latency  

### Failure Metrics
- Unsupported Guess Rate  
- Stale Context Error Rate  

---

## 10. Summary

The benchmark is designed to:

- start from **explicit capability definitions**  
- use **synthetic data for control and reproducibility**  
- scale context size to introduce realistic retrieval difficulty  
- evaluate retrieval methods under consistent conditions  
- measure both **accuracy and efficiency**

This ensures the evaluation is systematic, interpretable, and aligned with the capabilities the system is intended to support.