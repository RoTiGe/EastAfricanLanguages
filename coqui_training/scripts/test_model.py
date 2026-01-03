"""
Test Trained TTS Model
Generate speech from trained or fine-tuned model

Usage:
    python test_model.py --checkpoint checkpoints/oromo_vits/best_model.pth --text "Nagaa! Akkam jirta?"
    python test_model.py --model_path checkpoints/oromo_vits/ --text "Test text" --output test.wav
"""

import os
import sys
import argparse
from pathlib import Path

try:
    from TTS.utils.synthesizer import Synthesizer
    from TTS.config import load_config
    import torch
except ImportError:
    print("ERROR: TTS is not installed!")
    print("Install with: pip install TTS")
    sys.exit(1)


def parse_args():
    parser = argparse.ArgumentParser(description="Test trained TTS model")
    parser.add_argument(
        "--model_path",
        type=str,
        default=None,
        help="Path to model directory (contains best_model.pth and config.json)"
    )
    parser.add_argument(
        "--checkpoint",
        type=str,
        default=None,
        help="Path to specific checkpoint file (.pth)"
    )
    parser.add_argument(
        "--config",
        type=str,
        default=None,
        help="Path to config file (auto-detected if not provided)"
    )
    parser.add_argument(
        "--text",
        type=str,
        required=True,
        help="Text to synthesize"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="output.wav",
        help="Output audio file path"
    )
    parser.add_argument(
        "--vocoder_checkpoint",
        type=str,
        default=None,
        help="Path to vocoder checkpoint (optional, for Tacotron2)"
    )
    parser.add_argument(
        "--vocoder_config",
        type=str,
        default=None,
        help="Path to vocoder config (optional)"
    )
    parser.add_argument(
        "--gpu",
        action="store_true",
        help="Use GPU for inference"
    )
    
    return parser.parse_args()


def find_config_and_checkpoint(model_path):
    """Auto-detect config and checkpoint in model directory"""
    model_dir = Path(model_path)
    
    # Find config
    config_path = None
    for config_file in ['config.json', 'config.yaml']:
        candidate = model_dir / config_file
        if candidate.exists():
            config_path = str(candidate)
            break
    
    if not config_path:
        print(f"ERROR: No config file found in {model_path}")
        return None, None
    
    # Find checkpoint
    checkpoint_path = None
    
    # Look for best_model.pth
    best_model = model_dir / "best_model.pth"
    if best_model.exists():
        checkpoint_path = str(best_model)
    else:
        # Look for any .pth file
        checkpoints = list(model_dir.glob("*.pth"))
        if checkpoints:
            checkpoint_path = str(checkpoints[-1])  # Use latest
        else:
            print(f"ERROR: No checkpoint (.pth) found in {model_path}")
            return config_path, None
    
    return config_path, checkpoint_path


def main_test():
    args = parse_args()
    
    print("="*60)
    print("Testing TTS Model")
    print("="*60)
    
    # Determine config and checkpoint paths
    config_path = args.config
    checkpoint_path = args.checkpoint
    
    if args.model_path:
        auto_config, auto_checkpoint = find_config_and_checkpoint(args.model_path)
        if not config_path:
            config_path = auto_config
        if not checkpoint_path:
            checkpoint_path = auto_checkpoint
    
    if not config_path or not checkpoint_path:
        print("ERROR: Could not find config or checkpoint!")
        print("Provide either --model_path or both --config and --checkpoint")
        sys.exit(1)
    
    print(f"\nConfig: {config_path}")
    print(f"Checkpoint: {checkpoint_path}")
    print(f"Text: {args.text}")
    print(f"Output: {args.output}")
    
    # Load model
    print("\nLoading model...")
    
    try:
        config = load_config(config_path)
        
        # Determine if using GPU
        use_cuda = args.gpu and torch.cuda.is_available()
        if use_cuda:
            print("Using GPU for inference")
        else:
            print("Using CPU for inference")
        
        # Create synthesizer
        synthesizer = Synthesizer(
            tts_checkpoint=checkpoint_path,
            tts_config_path=config_path,
            vocoder_checkpoint=args.vocoder_checkpoint,
            vocoder_config=args.vocoder_config,
            use_cuda=use_cuda
        )
        
        print("✓ Model loaded successfully!")
        
        # Generate speech
        print(f"\nGenerating speech for: '{args.text}'")
        
        wav = synthesizer.tts(text=args.text)
        
        # Save audio
        synthesizer.save_wav(wav, args.output)
        
        print(f"\n✓ Audio saved to: {args.output}")
        print(f"Duration: {len(wav) / synthesizer.output_sample_rate:.2f} seconds")
        
        # Print audio stats
        import numpy as np
        print(f"Sample rate: {synthesizer.output_sample_rate} Hz")
        print(f"Audio range: [{np.min(wav):.3f}, {np.max(wav):.3f}]")
        
        print("\n" + "="*60)
        print("Test complete!")
        print("="*60)
        
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


def batch_test():
    """Test multiple sentences at once"""
    test_sentences = [
        "Nagaa! Akkam jirta?",
        "Maqaan koo Robel.",
        "Baga nagaan dhufte.",
        "Galatoomaa!",
        "Nagaatti."
    ]
    
    # TODO: Implement batch testing
    pass


if __name__ == "__main__":
    main_test()
