---
title: "Running LLM models locally using Ollama"
description: "A breakdown of my experiences running large language models locally using Ollama."
date: "2025-11-06"
tags:
  - tutorial
  - llm
  - ai/ml
---


While my github student pack was hanging in the middle of verification, I decided to give a try to [Ollama models](https://www.ollama.com/models) locally since I have a dedicated GPU.

This was a fun rabbit hole and a bittersweet ride. Here's my experience with the models as an absolute newbie.

---

## What the hell is ollama even about?

According to their page:

_"Ollama is the easiest way to get up and running with large language models such as gpt-oss, Gemma 3, DeepSeek-R1, Qwen3 and more."_

Simply put, it allows you to run open models on your local system.


## My machine configurations

You need some kind of GPU to run the model fast. It may work on CPU but the speed will be damn slow if you're using a bigger model. (yes, I've tried it). 

System configurations:

- Processor: Intel i5-12500H
- RAM: 16GB DDR4 @ 3200MHz
- GPU: Nvidia RTX 3050 Mobile (4GB) 
- VS Code with [Continue.dev](https://continue.dev/) extension to test out different model modes (chat, agent, etc)
- Ollama _(v0.12.9)_

---

## Models tested

_KC = Knowledge Cutoff; CS = Context Size_

| Model | Params | KC | CS | Notes |
|---|---:|---|---:|---|
| phi3:latest | 3.8b | early 2023 | 128K | Explanations are decent but not ideal for coding. |
| gemma3 | 4b | Sept 2021 | 128K (image input) | Good chat; a bit slow on my specs but usable. |
| llama3.2 | 3b | Dec 2023 | 128K | Better chat than gemma3; good explanations; weak agent; non-coding chats are solid. |
| deepseek-coder | 6.7b | (unknown) | 16K | Stronger agent mode than most; somewhat slow on my machine. |
| phi4-mini | 3.8b | Apr 2023 | 128K | Good for autocomplete and chat; agent mode manageable. |
| Qwen3 | 4b | Oct 2024 | 256K | Partly CPU-loaded (≈80:20 GPU:CPU); detailed but verbose; agent mode not great; occasional thinking loops. |
| Granite 3.1 MoE | 3b | Mar 2023 | 128K | Short, to-the-point suggestions; good tab completions. |
| Granite 3.3 | 2b | Apr 2023 | 128K | More detailed than 3.1 MoE; good suggestions; agent mode not good. |
| Qwen 2.5 | 3b | 2023 | 32K | Great explanations; good agent mode. |
| StarCoder2 | 3b | (no valid resp.) | 16K | Responses were irrelevant in my tests; needs retesting. |
| Qwen 2.5 Coder | 3b | Oct 2023 | 32K | Excellent for coding queries; likely my main LLM when Copilot expires. |
| Cogito | 3b | Oct 2023 | 128K | Good code improvement suggestions. |
| DeepSeek V3.1 (cloud) | 671b | Oct 2023 | 160K | Cloud model (~404 GB); great explanations; deep thinking; sometimes long delays (3–5 min). |
| Kimi K2 (cloud) | 1t | Oct 2023 | 256K | Excellent explanations; very detailed when using large token outputs; strong code rationale. |

---

### How to check model status?

You can check your current running model's status by running the follwoing command:

`ollama ps`

---

## Workload sharing by your resources

If the models are not completely loaded on GPU, it will share some of it's workload to the CPU as well. You can see these stats by running above mentioned command.

Don't forget to checkout the load shared by CPU and GPU. That will give you the idea if the model is loaded aptly or do you need to upgrade/downgrade it.

Token size also affects how the memory is shared between cpu/gpu which is an interesting thing to note.

---

## Additional Notes

Even if you don't have a dedicated GPU _(dGPU)_, you can still configure to use your inteegrated GPU _(iGPU)_ though the speed might not be comparable but it will get your your done. Try out different models and figure out which one give you the best of speed and accuracy. You can choose from the above metioned models as well as some of their lightweight models to better suit your usecase.

Some models are called "embedding models" which contains a few million parameters. These are text-only models majorly and are best for systems with limited resources like mobile devices or IoT systems like Raspberry Pi, Arduino, etc. A few examples: [Granite (by IBM)](https://ollama.com/library/granite-embedding), [EmbeddingGemma (by Google Deepmind)](https://ollama.com/library/embeddinggemma). 

Another workaround for running bigger models on limited resource devices can be to use the [Ollama Cloud](https://ollama.com/cloud) and connect to heavier cloud models like _kimi-k2-1t._ Their free plan is quite good with daily and weekly limit for general usecase and you can opt for paid plan anytime for more usage.

---

## Ending thoughts

Overall, it was quite a fun exploration of these models and I've gained a few exploratory knowledge about the LLM world. Still there is much more to learn like hosting these models on cloud and serving them directly to your users, customizing according to your requirement, etc.

I would like to hear your thoughts about LLMs and your experiences with it. You can [tag me on X](https://x.com/animeshk923) (Twitter) and we'll start a conversation on it. Looking forward to it!

Thank you for reading and I'll see you in the next one.

Happy Tinkering!