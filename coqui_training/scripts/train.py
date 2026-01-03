"""
Train Coqui TTS Model for Oromo Language
Usage:
    python train.py --config_path configs/oromo_vits.json
    python train.py --config_path configs/oromo_tacotron2.json --restore_path checkpoints/model.pth
"""

import os
import sys
import argparse
from pathlib import Path

# Add TTS to path
try:
    from TTS.bin.train_tts import main
    from TTS.config import load_config
except ImportError:
    print("ERROR: TTS is not installed!")
    print("Install with: pip install TTS")
    print("Note: Requires Python 3.9, 3.10, or 3.11 (NOT 3.12+)")
    sys.exit(1)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Train TTS model for Oromo language"
    )
    parser.add_argument(
        "--config_path",
        type=str,
        required=True,
        help="Path to config file (e.g., configs/oromo_vits.json)"
    )
    parser.add_argument(
        "--restore_path",
        type=str,
        default=None,
        help="Path to checkpoint to resume training"
    )
    parser.add_argument(
        "--output_path",
        type=str,
        default=None,
        help="Output path for checkpoints (overrides config)"
    )
    parser.add_argument(
        "--gpu",
        type=int,
        default=0,
        help="GPU device ID (default: 0)"
    )
    parser.add_argument(
        "--coqpit",
        action="store_true",
        help="Use coqpit config format"
    )
    
    return parser.parse_args()


def validate_config(config_path):
    """Validate config file exists and is readable"""
    if not os.path.exists(config_path):
        print(f"ERROR: Config file not found: {config_path}")
        return False
    
    try:
        config = load_config(config_path)
        print(f"✓ Config loaded: {config.model}")
        
        # Check dataset path
        if hasattr(config, 'datasets') and config.datasets:
            dataset_path = config.datasets[0]['path']
            if not os.path.exists(dataset_path):
                print(f"WARNING: Dataset path does not exist: {dataset_path}")
                print("Please prepare your dataset first!")
        
        return True
    except Exception as e:
        print(f"ERROR: Failed to load config: {e}")
        return False


def check_gpu():
    """Check if GPU is available"""
    try:
        import torch
        if torch.cuda.is_available():
            print(f"✓ GPU available: {torch.cuda.get_device_name(0)}")
            print(f"  VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
            return True
        else:
            print("WARNING: No GPU detected. Training will be VERY slow on CPU!")
            response = input("Continue anyway? (y/n): ")
            return response.lower() == 'y'
    except ImportError:
        print("WARNING: PyTorch not installed!")
        return False


def main_train():
    """Main training function"""
    args = parse_args()
    
    print("="*60)
    print("Coqui TTS Training for Oromo Language")
    print("="*60)
    
    # Validate config
    if not validate_config(args.config_path):
        sys.exit(1)
    
    # Check GPU
    if not check_gpu():
        print("Exiting...")
        sys.exit(1)
    
    # Prepare arguments for TTS trainer
    tts_args = [
        "--config_path", args.config_path,
    ]
    
    if args.restore_path:
        tts_args.extend(["--restore_path", args.restore_path])
    
    if args.output_path:
        tts_args.extend(["--output_path", args.output_path])
    
    if args.coqpit:
        tts_args.append("--coqpit")
    
    # Set GPU
    os.environ["CUDA_VISIBLE_DEVICES"] = str(args.gpu)
    
    print("\n" + "="*60)
    print("Starting training...")
    print("Config:", args.config_path)
    if args.restore_path:
        print("Resuming from:", args.restore_path)
    print("="*60 + "\n")
    
    # Start training
    sys.argv = ["train_tts.py"] + tts_args
    
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTraining interrupted by user!")
    except Exception as e:
        print(f"\n\nERROR during training: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main_train()
