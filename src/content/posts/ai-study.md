---
title: AI学习和总结
description: 关于近期AI的入门学习和总结
pubDate: 2026-10-09
tags: [技术, AI]
---

## RAG

### 步骤
1. 离线阶段：文档加载切分chunk。根据自然语义切分，并且设置一定overlap。然后用embedding模型向量化，存储在向量数据库
2. 在线阶段：提问后，用同样模型把问题向量化，然后做混合检索，召回后根据相关性rerank
3. 生成：把检索到的内容和用户问题拼成 prompt，要求模型基于给定资料回答，不知道就说不知道，并且尽量附上引用来源

### 优化

#### 提问优化
1. 优化问题
- 多查询策略 Multi-Query
- 多查询结果融合 RAG-Fusion：
'''
1. 生成多个查询
2. 并行检索
3. 使用RRF算法融合结果
4. 返回重新排序的Top-K文档
'''
2. 问题分解策略
顺序分解，并行分解，层次分解
3. step back问答回退
4. HyDE 用假答案区匹配真答案（优缺点
5. 路由优化（逻辑路由，语义路由
6. 问题构建策略（变成数据库语言检索
#### 离线阶段 - 索引生成优化

Multi-representation	  



RAPTOR	

  ColBERT

#### 在线阶段 - 检索优化

1. Ranking（排序）：对检索结果进行初步排序
2. Refinement（精炼）：对检索结果进行过滤和优化
3. Adaptive Retrieval（自适应检索）：根据查询特征动态调整检索策略

#### 生成 - 优化
CRAG


 Self-RAG

Agent



LangChain



LangGraph



Transformer



Harness