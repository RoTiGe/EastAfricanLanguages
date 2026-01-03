"""
Preprocess Audio Files for TTS Training
- Convert to WAV format
- Resample to 22050 Hz (or config specified rate)
- Convert to mono
- Trim silence
- Normalize volume
- Split long audio into clips

Usage:
    python preprocess.py --input_dir datasets/oromo/raw_audio --output_dir datasets/oromo/wavs
    python preprocess.py --input_dir datasets/oromo/raw_audio --split_long --max_duration 10
"""

import os
import sys
import argparse
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

try:
    from pydub import AudioSegment
    from pydub.silence import split_on_silence
    import librosa
    import soundfile as sf
    import numpy as np
except ImportError as e:
    print(f"ERROR: Missing dependency: {e}")
    print("Install with: pip install pydub librosa soundfile")
    sys.exit(1)


def parse_args():
    parser = argparse.ArgumentParser(description="Preprocess audio for TTS training")
    parser.add_argument("--input_dir", type=str, required=True, help="Input directory with audio files")
    parser.add_argument("--output_dir", type=str, required=True, help="Output directory for processed files")
    parser.add_argument("--sample_rate", type=int, default=22050, help="Target sample rate (default: 22050)")
    parser.add_argument("--trim_silence", action="store_true", help="Trim silence from beginning/end")
    parser.add_argument("--split_long", action="store_true", help="Split long audio files")
    parser.add_argument("--max_duration", type=float, default=10.0, help="Max duration in seconds (for splitting)")
    parser.add_argument("--normalize", action="store_true", default=True, help="Normalize audio volume")
    parser.add_argument("--trim_db", type=int, default=20, help="dB threshold for silence trimming")
    
    return parser.parse_args()


def convert_to_wav(input_path, output_path, sample_rate=22050):
    """Convert audio file to WAV format with specified sample rate"""
    try:
        # Load audio
        audio, sr = librosa.load(input_path, sr=sample_rate, mono=True)
        
        # Save as WAV
        sf.write(output_path, audio, sample_rate, subtype='PCM_16')
        return True
    except Exception as e:
        print(f"  ERROR converting {input_path}: {e}")
        return False


def trim_silence_from_audio(audio_path, output_path, trim_db=20):
    """Trim silence from beginning and end of audio"""
    try:
        audio = AudioSegment.from_wav(audio_path)
        
        # Trim silence
        trimmed = audio.strip_silence(silence_thresh=trim_db)
        
        # Save
        trimmed.export(output_path, format="wav")
        return True
    except Exception as e:
        print(f"  ERROR trimming {audio_path}: {e}")
        return False


def normalize_audio(audio_path, output_path):
    """Normalize audio volume"""
    try:
        audio, sr = librosa.load(audio_path, sr=None)
        
        # Normalize to -3 dB
        audio = librosa.util.normalize(audio)
        audio = audio * 0.7  # Reduce to -3 dB
        
        sf.write(output_path, audio, sr, subtype='PCM_16')
        return True
    except Exception as e:
        print(f"  ERROR normalizing {audio_path}: {e}")
        return False


def split_audio_file(audio_path, output_dir, base_name, max_duration=10.0):
    """Split long audio file into smaller clips"""
    try:
        audio = AudioSegment.from_wav(audio_path)
        duration = len(audio) / 1000.0  # Convert to seconds
        
        if duration <= max_duration:
            return [audio_path]
        
        # Split into chunks
        max_len = int(max_duration * 1000)  # Convert to milliseconds
        chunks = []
        
        for i in range(0, len(audio), max_len):
            chunk = audio[i:i+max_len]
            if len(chunk) > 1000:  # Only save if > 1 second
                chunk_path = os.path.join(output_dir, f"{base_name}_part{i//max_len:03d}.wav")
                chunk.export(chunk_path, format="wav")
                chunks.append(chunk_path)
        
        return chunks
    except Exception as e:
        print(f"  ERROR splitting {audio_path}: {e}")
        return []


def process_audio_file(input_path, output_dir, args, file_index):
    """Process a single audio file"""
    file_name = Path(input_path).stem
    base_output_path = os.path.join(output_dir, f"{file_name}.wav")
    
    print(f"  [{file_index}] Processing: {Path(input_path).name}")
    
    # Step 1: Convert to WAV with target sample rate
    temp_path = os.path.join(output_dir, f"temp_{file_name}.wav")
    if not convert_to_wav(input_path, temp_path, args.sample_rate):
        return []
    
    # Step 2: Trim silence
    if args.trim_silence:
        trimmed_path = os.path.join(output_dir, f"trimmed_{file_name}.wav")
        if trim_silence_from_audio(temp_path, trimmed_path, args.trim_db):
            os.remove(temp_path)
            temp_path = trimmed_path
    
    # Step 3: Normalize
    if args.normalize:
        normalized_path = os.path.join(output_dir, f"normalized_{file_name}.wav")
        if normalize_audio(temp_path, normalized_path):
            os.remove(temp_path)
            temp_path = normalized_path
    
    # Step 4: Split if needed
    output_files = []
    if args.split_long:
        chunks = split_audio_file(temp_path, output_dir, file_name, args.max_duration)
        output_files.extend(chunks)
        os.remove(temp_path)
    else:
        # Just rename to final name
        os.rename(temp_path, base_output_path)
        output_files.append(base_output_path)
    
    return output_files


def main():
    args = parse_args()
    
    print("="*60)
    print("Audio Preprocessing for TTS Training")
    print("="*60)
    
    # Create output directory
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Find audio files
    audio_extensions = ['.wav', '.mp3', '.flac', '.m4a', '.ogg', '.opus']
    audio_files = []
    
    for ext in audio_extensions:
        audio_files.extend(Path(args.input_dir).rglob(f"*{ext}"))
    
    if not audio_files:
        print(f"ERROR: No audio files found in {args.input_dir}")
        sys.exit(1)
    
    print(f"\nFound {len(audio_files)} audio files")
    print(f"Output directory: {args.output_dir}")
    print(f"Sample rate: {args.sample_rate} Hz")
    print(f"Trim silence: {args.trim_silence}")
    print(f"Split long files: {args.split_long}")
    if args.split_long:
        print(f"Max duration: {args.max_duration} seconds")
    print()
    
    # Process each file
    processed_files = []
    errors = 0
    
    for i, audio_file in enumerate(audio_files, 1):
        try:
            output_files = process_audio_file(str(audio_file), args.output_dir, args, i)
            processed_files.extend(output_files)
        except Exception as e:
            print(f"  ERROR: {e}")
            errors += 1
    
    print("\n" + "="*60)
    print(f"Preprocessing complete!")
    print(f"Input files: {len(audio_files)}")
    print(f"Output files: {len(processed_files)}")
    print(f"Errors: {errors}")
    print(f"Output directory: {args.output_dir}")
    print("="*60)
    
    print("\nNext steps:")
    print("1. Create metadata.csv with transcriptions")
    print("2. Split into train/val sets")
    print("3. Start training!")


if __name__ == "__main__":
    main()
