# Lightweight tag assignment routine for abstracts
# Uses OpenAI API for semantic similarity (can be replaced with local embedding model)
from transformers import AutoTokenizer, AutoModel
import torch

# Predefined tag list (can be expanded)
TAGS = [
    "language models",
    "deep learning",
    "NLP",
    "reasoning",
    "multimodality",
    "interpretability",
    "compositionality",
    "grounding",
    "dataset",
    "evaluation",
    "pretraining",
    "fine-tuning",
    "semantic similarity",
    "paraphrasing",
    "simplification",
    "style",
    "bias",
    "vision",
    "symbolic reasoning",
    "transfer learning",
    "cognitive science",
    "probing",
    "representation learning",
    "coreference",
    "syntactic heuristics",
    "natural language inference",
    "annotation",
    "gender",
    "generalization",
    "formality",
    "color",
    "knowledge",
    "captioning",
    "visual question answering",
    "lexical simplification",
    "multilingual",
    "pretraining tasks",
    "function words",
    "robustness",
    "evaluation harness",
    "distributional semantics",
    "circuit analysis",
    "crowdsourcing",
    "atomic edits",
    "structural compositionality",
    "adjective-noun composition",
    "veridicality",
    "event detection",
    "training data attribution",
    "curriculum learning",
    "bootstrapping",
    "transfer",
    "neural networks",
    "linguistic structure",
]

MODEL_ID = "prajjwal1/bert-tiny"

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModel.from_pretrained(MODEL_ID)
model.eval()


def embed_text(text):
    with torch.no_grad():
        tokens = tokenizer(text, return_tensors="pt", truncation=True, max_length=32)
        outputs = model(**tokens)
        # Average token embeddings (excluding [CLS], [SEP])
        last_hidden = outputs.last_hidden_state.squeeze(0)
        # Exclude special tokens
        input_ids = tokens["input_ids"].squeeze(0)
        mask = (input_ids != tokenizer.cls_token_id) & (
            input_ids != tokenizer.sep_token_id
        )
        valid_tokens = last_hidden[mask]
        if valid_tokens.shape[0] == 0:
            return last_hidden.mean(dim=0)
        return valid_tokens.mean(dim=0)


def cosine(u, v):
    return float(torch.dot(u, v) / (torch.norm(u) * torch.norm(v)))


def get_tags_for_abstract(abstract, tag_list=TAGS, top_k=5, min_k=2, sim_thresh=0.25):
    abs_vec = embed_text(abstract)
    tag_vecs = [embed_text(tag) for tag in tag_list]
    scores = [(tag, cosine(abs_vec, vec)) for tag, vec in zip(tag_list, tag_vecs)]
    scores.sort(key=lambda x: x[1], reverse=True)
    selected = [tag for tag, score in scores if score >= sim_thresh][:top_k]
    # Ensure at least min_k tags
    if len(selected) < min_k:
        selected = [tag for tag, _ in scores[:min_k]]
    return selected


# Example usage:
# tags = get_tags_for_abstract("This paper introduces a new language model for NLP tasks.")
# print(tags)
