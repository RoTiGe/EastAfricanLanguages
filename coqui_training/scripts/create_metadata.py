"""
Create metadata.csv from audio files
Helps you build the metadata file interactively

Usage:
    python create_metadata.py --audio_dir datasets/oromo/wavs
"""

import os
import argparse
from pathlib import Path
import sys


def parse_args():
    parser = argparse.ArgumentParser(description="Create metadata.csv interactively")
    parser.add_argument("--audio_dir", type=str, required=True, help="Directory with WAV files")
    parser.add_argument("--output", type=str, default="metadata.csv", help="Output metadata file")
    parser.add_argument("--auto_split", action="store_true", help="Auto-create train/val split")
    parser.add_argument("--val_ratio", type=float, default=0.15, help="Validation split ratio")
    
    return parser.parse_args()


def get_audio_files(audio_dir):
    """Get all WAV files in directory"""
    audio_files = sorted(list(Path(audio_dir).glob("*.wav")))
    return audio_files


def interactive_transcription(audio_files, output_file):
    """Interactively create metadata"""
    print("\n" + "="*60)
    print("Interactive Metadata Creation")
    print("="*60)
    print("\nInstructions:")
    print("- Type the Oromo transcription for each audio file")
    print("- Press Enter to skip a file")
    print("- Type 'quit' to stop and save")
    print("="*60 + "\n")
    
    metadata_lines = []
    
    for i, audio_file in enumerate(audio_files, 1):
        print(f"\n[{i}/{len(audio_files)}] File: {audio_file.name}")
        print("-" * 60)
        
        # Get transcription
        transcription = input("Transcription: ").strip()
        
        if transcription.lower() == 'quit':
            print("\nStopping...")
            break
        
        if not transcription:
            print("  → Skipped")
            continue
        
        # Add to metadata
        relative_path = f"wavs/{audio_file.name}"
        metadata_lines.append(f"{relative_path}|{transcription}\n")
        print("  ✓ Added")
    
    # Save metadata
    with open(output_file, 'w', encoding='utf-8') as f:
        f.writelines(metadata_lines)
    
    print(f"\n✓ Saved {len(metadata_lines)} entries to {output_file}")
    
    return metadata_lines


def auto_split(metadata_lines, val_ratio):
    """Split metadata into train/val"""
    import random
    
    random.shuffle(metadata_lines)
    
    split_idx = int(len(metadata_lines) * (1 - val_ratio))
    train_lines = metadata_lines[:split_idx]
    val_lines = metadata_lines[split_idx:]
    
    # Save train
    with open("metadata.csv", 'w', encoding='utf-8') as f:
        f.writelines(train_lines)
    
    # Save val
    with open("metadata_val.csv", 'w', encoding='utf-8') as f:
        f.writelines(val_lines)
    
    print(f"\n✓ Split into:")
    print(f"  Training: {len(train_lines)} samples → metadata.csv")
    print(f"  Validation: {len(val_lines)} samples → metadata_val.csv")


def batch_import_from_file(text_file, audio_dir, output_file):
    """Import from a text file with transcriptions"""
    print(f"\nImporting from {text_file}...")
    
    with open(text_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    audio_files = sorted(list(Path(audio_dir).glob("*.wav")))
    
    if len(lines) != len(audio_files):
        print(f"WARNING: {len(lines)} transcriptions but {len(audio_files)} audio files!")
        print("Proceeding with minimum of the two...")
    
    metadata_lines = []
    
    for audio_file, transcription in zip(audio_files, lines):
        transcription = transcription.strip()
        if transcription:
            relative_path = f"wavs/{audio_file.name}"
            metadata_lines.append(f"{relative_path}|{transcription}\n")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.writelines(metadata_lines)
    
    print(f"✓ Created {output_file} with {len(metadata_lines)} entries")
    
    return metadata_lines


def main():
    args = parse_args()
    
    # Check audio directory
    if not os.path.exists(args.audio_dir):
        print(f"ERROR: Audio directory not found: {args.audio_dir}")
        sys.exit(1)
    
    # Get audio files
    audio_files = get_audio_files(args.audio_dir)
    
    if not audio_files:
        print(f"ERROR: No WAV files found in {args.audio_dir}")
        sys.exit(1)
    
    print(f"Found {len(audio_files)} audio files in {args.audio_dir}")
    
    # Ask user for input method
    print("\nHow would you like to create metadata?")
    print("1. Interactive (type transcription for each file)")
    print("2. Import from text file (one line per audio file)")
    print("3. Template (create empty metadata.csv to fill manually)")
    
    choice = input("\nChoice (1/2/3): ").strip()
    
    if choice == "1":
        # Interactive mode
        metadata_lines = interactive_transcription(audio_files, args.output)
    
    elif choice == "2":
        # Import from file
        text_file = input("Path to text file: ").strip()
        if not os.path.exists(text_file):
            print(f"ERROR: File not found: {text_file}")
            sys.exit(1)
        metadata_lines = batch_import_from_file(text_file, args.audio_dir, args.output)
    
    elif choice == "3":
        # Create template
        metadata_lines = []
        for audio_file in audio_files:
            relative_path = f"wavs/{audio_file.name}"
            metadata_lines.append(f"{relative_path}|[TRANSCRIPTION HERE]\n")
        
        with open(args.output, 'w', encoding='utf-8') as f:
            f.writelines(metadata_lines)
        
        print(f"\n✓ Created template: {args.output}")
        print("Now edit this file and replace [TRANSCRIPTION HERE] with actual transcriptions")
        
        return
    
    else:
        print("Invalid choice!")
        sys.exit(1)
    
    # Auto-split if requested
    if args.auto_split and metadata_lines:
        auto_split(metadata_lines, args.val_ratio)
    
    print("\n" + "="*60)
    print("Metadata creation complete!")
    print("="*60)
    print(f"\nNext steps:")
    print(f"1. Review {args.output}")
    print(f"2. If not auto-split, create metadata_val.csv manually")
    print(f"3. Start training!")


if __name__ == "__main__":
    main()
