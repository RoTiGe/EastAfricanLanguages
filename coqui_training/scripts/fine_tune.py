"""
Fine-tune Pre-trained TTS Model for Oromo Language
This is MUCH faster than training from scratch and requires less data (30-60 min vs 100+ hours)

Usage:
    python fine_tune.py --config_path configs/oromo_vits.json --pretrained_model vits_multilingual
    python fine_tune.py --config_path configs/oromo_vits.json --checkpoint_path path/to/model.pth
"""

import os
import sys
import argparse
import json
from pathlib import Path

try:
    from TTS.bin.train_tts import main
    from TTS.config import load_config
    from TTS.utils.manage import ModelManager
except ImportError:
    print("ERROR: TTS is not installed!")
    print("Install with: pip install TTS")
    sys.exit(1)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Fine-tune pre-trained TTS model for Oromo"
    )
    parser.add_argument(
        "--config_path",
        type=str,
        required=True,
        help="Path to config file"
    )
    parser.add_argument(
        "--pretrained_model",
        type=str,
        default=None,
        help="Name of pre-trained model (e.g., 'vits_multilingual', 'tacotron2')"
    )
    parser.add_argument(
        "--checkpoint_path",
        type=str,
        default=None,
        help="Path to custom checkpoint file"
    )
    parser.add_argument(
        "--output_path",
        type=str,
        default="checkpoints/oromo_finetune/",
        help="Output path for fine-tuned model"
    )
    parser.add_argument(
        "--freeze_encoder",
        action="store_true",
        help="Freeze encoder weights (train only decoder)"
    )
    parser.add_argument(
        "--learning_rate",
        type=float,
        default=0.0001,
        help="Learning rate (lower for fine-tuning)"
    )
    parser.add_argument(
        "--gpu",
        type=int,
        default=0,
        help="GPU device ID"
    )
    
    return parser.parse_args()


def download_pretrained_model(model_name):
    """Download pre-trained model from Coqui TTS"""
    print(f"Downloading pre-trained model: {model_name}")
    
    manager = ModelManager()
    
    # Common pre-trained models
    model_mapping = {
        "vits_multilingual": "tts_models/multilingual/multi-dataset/your_tts",
        "xtts_v2": "tts_models/multilingual/multi-dataset/xtts_v2",
        "tacotron2": "tts_models/en/ljspeech/tacotron2-DDC",
        "glow_tts": "tts_models/en/ljspeech/glow-tts",
    }
    
    if model_name in model_mapping:
        model_path, config_path, _ = manager.download_model(model_mapping[model_name])
        return model_path, config_path
    else:
        # Try direct model name
        try:
            model_path, config_path, _ = manager.download_model(model_name)
            return model_path, config_path
        except Exception as e:
            print(f"ERROR: Could not download model '{model_name}'")
            print(f"Available models: {list(model_mapping.keys())}")
            print(f"Or use full model path like: tts_models/multilingual/multi-dataset/your_tts")
            sys.exit(1)


def modify_config_for_finetuning(config_path, checkpoint_path, learning_rate, freeze_encoder):
    """Modify config for fine-tuning"""
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Lower learning rate for fine-tuning
    config['lr'] = learning_rate
    
    # Add checkpoint path
    config['restore_path'] = checkpoint_path
    
    # Optionally freeze encoder
    if freeze_encoder and 'model_args' in config:
        config['model_args']['freeze_encoder'] = True
    
    # Save modified config
    finetune_config_path = config_path.replace('.json', '_finetune.json')
    with open(finetune_config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"✓ Created fine-tuning config: {finetune_config_path}")
    return finetune_config_path


def main_finetune():
    """Main fine-tuning function"""
    args = parse_args()
    
    print("="*60)
    print("Fine-tuning TTS Model for Oromo Language")
    print("="*60)
    
    # Get checkpoint path
    checkpoint_path = args.checkpoint_path
    
    if args.pretrained_model and not checkpoint_path:
        print(f"\nDownloading pre-trained model: {args.pretrained_model}")
        checkpoint_path, _ = download_pretrained_model(args.pretrained_model)
        print(f"✓ Downloaded to: {checkpoint_path}")
    
    if not checkpoint_path:
        print("ERROR: Must provide either --pretrained_model or --checkpoint_path")
        sys.exit(1)
    
    if not os.path.exists(checkpoint_path):
        print(f"ERROR: Checkpoint not found: {checkpoint_path}")
        sys.exit(1)
    
    # Modify config for fine-tuning
    finetune_config = modify_config_for_finetuning(
        args.config_path,
        checkpoint_path,
        args.learning_rate,
        args.freeze_encoder
    )
    
    # Prepare training arguments
    tts_args = [
        "--config_path", finetune_config,
        "--restore_path", checkpoint_path,
        "--output_path", args.output_path
    ]
    
    # Set GPU
    os.environ["CUDA_VISIBLE_DEVICES"] = str(args.gpu)
    
    print("\n" + "="*60)
    print("Starting fine-tuning...")
    print("Base model:", checkpoint_path)
    print("Config:", finetune_config)
    print("Output:", args.output_path)
    print("Learning rate:", args.learning_rate)
    if args.freeze_encoder:
        print("Encoder: FROZEN (only training decoder)")
    print("="*60 + "\n")
    
    # Start training
    sys.argv = ["train_tts.py"] + tts_args
    
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nFine-tuning interrupted by user!")
    except Exception as e:
        print(f"\n\nERROR during fine-tuning: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main_finetune()
