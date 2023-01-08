export type Scopes =
  | 'playlist-modify-private'
  | 'streaming'
  | 'playlist-modify-public'
  | 'playlist-read-collaborative'
  | 'playlist-read-private'
  | 'playlist-read-public'
  | 'ugc-image-upload'
  | 'user-follow-modify'
  | 'user-follow-read'
  | 'user-library-modify'
  | 'user-library-read'
  | 'user-modify-playback-state'
  | 'user-read-currently-playing'
  | 'user-read-email'
  | 'user-read-playback-position'
  | 'user-read-playback-state'
  | 'user-read-private'
  | 'user-read-recently-played'
  | 'user-top-read'

type SegmentPrediction = {
  /** The starting point (in seconds) of the time interval. */
  start: number
  /** The duration (in seconds) of the time interval. */
  duration: number
  /** The confidence, from 0.0 to 1.0, of the reliability of the interval. */
  confidence: number
}

/** 200 responses from the API */
export type OK = {
  '/me/player/devices': {
    devices: Device[]
  }

  '/audio-analysis/{id}': {
    meta: {
      /** The version of the Analyzer used to analyze this track. */
      analyzer_version: string
      /** The platform used to read the track's audio data. */
      platform: string
      /**
       * A detailed status code for this track. If analysis data is missing,
       * this code may explain why.
       */
      detailed_status: string
      /**
       * The return code of the analyzer process. 0 if successful, 1 if any
       * errors occurred.
       */
      status_code: number
      /** The Unix timestamp (in seconds) at which this track was analyzed. */
      timestamp: number
      /** The amount of time taken to analyze this track. */
      analysis_time: number
      /** The method used to read the track's audio data. */
      input_process: string
    }

    track: {
      /**
       * The exact number of audio samples analyzed from this track. See also
       * analysis_sample_rate.
       */
      num_samples: number
      /** Length of the track in seconds. */
      duration: number
      /** This field will always contain the empty string. */
      sample_md5: string
      /**
       * An offset to the start of the region of the track that was analyzed.
       * (As the entire track is analyzed, this should always be 0.)
       */
      offset_seconds: number
      /**
       * The length of the region of the track was analyzed, if a subset of the
       * track was analyzed. (As the entire track is analyzed, this should
       * always be 0.)
       */
      window_seconds: number
      /**
       * The sample rate used to decode and analyze this track. May differ from
       * the actual sample rate of this track available on Spotify.
       */
      analysis_sample_rate: number
      /**
       * The number of channels used for analysis. If 1, all channels are summed
       * together to mono before analysis.
       */
      analysis_channels: number
      /**
       * The time, in seconds, at which the track's fade-in period ends. If the
       * track has no fade-in, this will be 0.0.
       */
      end_of_fade_in: number
      /**
       * The time, in seconds, at which the track's fade-out period starts. If
       * the track has no fade-out, this should match the track's length.
       */
      start_of_fade_out: number
      /**
       * The overall loudness of a track in decibels (dB). Loudness values are
       * averaged across the entire track and are useful for comparing relative
       * loudness of tracks. Loudness is the quality of a sound that is the
       * primary psychological correlate of physical strength (amplitude).
       * Values typically range between -60 and 0 db.
       */
      loudness: number
      /**
       * The overall estimated tempo of a track in beats per minute (BPM). In
       * musical terminology, tempo is the speed or pace of a given piece and
       * derives directly from the average beat duration.
       */
      tempo: number
      /** The confidence, from 0.0 to 1.0, of the reliability of the tempo. */
      tempo_confidence: number
      /**
       * An estimated time signature. The time signature (meter) is a notational
       * convention to specify how many beats are in each bar (or measure). The
       * time signature ranges from 3 to 7 indicating time signatures of "3/4",
       * to "7/4".
       */
      time_signature: number
      /**
       * The confidence, from 0.0 to 1.0, of the reliability of the
       * time_signature.
       */
      time_signature_confidence: number
      /**
       * The key the track is in. Integers map to pitches using standard Pitch
       * Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was
       * detected, the value is -1.
       */
      key: number
      /** The confidence, from 0.0 to 1.0, of the reliability of the key. */
      key_confidence: number
      /**
       * Mode indicates the modality (major or minor) of a track, the type of
       * scale from which its melodic content is derived. Major is represented
       * by 1 and minor is 0.
       */
      mode: number
      /** The confidence, from 0.0 to 1.0, of the reliability of the mode. */
      mode_confidence: number
      /** An Echo Nest Musical Fingerprint (ENMFP) codestring for this track. */
      codestring: string
      /**
       * A version number for the Echo Nest Musical Fingerprint format used in
       * the codestring field.
       */
      code_version: number
      /** An EchoPrint codestring for this track. */
      echoprintstring: string
      /**
       * A version number for the EchoPrint format used in the echoprintstring
       * field.
       */
      echoprint_version: number
      /** A Synchstring for this track. */
      synchstring: string
      /** A version number for the Synchstring used in the synchstring field. */
      synch_version: number
      /**
       * A Rhythmstring for this track. The format of this string is similar to
       * the Synchstring.
       */
      rhythmstring: string
      /** A version number for the Rhythmstring used in the rhythmstring field. */
      rhythm_version: number
    }

    /**
     * The time intervals of the bars throughout the track. A bar (or measure)
     * is a segment of time defined as a given number of beats.
     */
    bars: SegmentPrediction[]

    /**
     * The time intervals of beats throughout the track. A beat is the basic
     * time unit of a piece of music; for example, each tick of a metronome.
     * Beats are typically multiples of tatums.
     */
    beats: SegmentPrediction[]

    /**
     * Chorus, verse, bridge, guitar solo, etc. Each section contains its own
     * descriptions of tempo, key, mode, time_signature, and loudness.
     */
    sections: (SegmentPrediction & {
      /**
       * The overall loudness of the section in decibels(dB).Loudness values are
       * useful for comparing relative loudness of sections within tracks.
       */
      loudness: number
      /**
       * The overall estimated tempo of the section in beats per minute(BPM).In
       * musical terminology, tempo is the speed or pace of a given piece and
       * derives directly from the average beat duration.
       */
      tempo: number
      /**
       * The confidence, from 0.0 to 1.0, of the reliability of the tempo.Some
       * tracks contain tempo changes or sounds which don't contain tempo (like
       * pure speech) which would correspond to a low value in this field.
       */
      tempo_confidence: number
      /**
       * The estimated overall key of the section.The values in this field
       * ranging from 0 to 11 mapping to pitches using standard Pitch Class
       * notation(E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on). If no key was
       * detected, the value is -1.
       */
      key: number
      /**
       * The confidence, from 0.0 to 1.0, of the reliability of the key.Songs
       * with many key changes may correspond to low values in this field.
       */
      key_confidence: number
      /**
       * Indicates the modality(major or minor) of a section, the type of scale
       * from which its melodic content is derived.This field will contain a 0
       * for "minor", a 1 for "major", or a - 1 for no result.Note that the
       * major key(e.g.C major) could more likely be confused with the minor key
       * at 3 semitones lower(e.g.A minor) as both keys carry the same pitches.
       */
      mode: number
      /** The confidence, from 0.0 to 1.0, of the reliability of the mode. */
      mode_confidence: number
      /**
       * An estimated time signature.The time signature(meter) is a notational
       * convention to specify how many beats are in each bar(or measure).The
       * time signature ranges from 3 to 7 indicating time signatures of "3/4",
       * to "7/4".
       */
      time_signature: number
      /**
       * The confidence, from 0.0 to 1.0, of the reliability of the
       * time_signature.Sections with time signature changes may correspond to
       * low values in this field.
       */
      time_signature_confidence: number
    })[]

    /* Each segment contains a roughly conisistent sound throughout its duration. */
    segments: (SegmentPrediction & {
      /**
       * The onset loudness of the segment in decibels (dB). Combined with
       * loudness_max and loudness_max_time, these components can be used to
       * describe the "attack" of the segment.
       */
      loudness_start: number
      /**
       * The peak loudness of the segment in decibels (dB). Combined with
       * loudness_start and loudness_max_time, these components can be used to
       * describe the "attack" of the segment.
       */
      loudness_max: number
      /**
       * The segment-relative offset of the segment peak loudness in seconds.
       * Combined with loudness_start and loudness_max, these components can be
       * used to desctibe the "attack" of the segment.
       */
      loudness_max_time: number
      /**
       * The offset loudness of the segment in decibels (dB). This value should
       * be equivalent to the loudness_start of the following segment.
       */
      loudness_end: number

      /**
       * Pitch content is given by a “chroma” vector, corresponding to the 12
       * pitch classes C, C#, D to B, with values ranging from 0 to 1 that
       * describe the relative dominance of every pitch in the chromatic scale.
       * For example a C Major chord would likely be represented by large values
       * of C, E and G (i.e. classes 0, 4, and 7).
       *
       * Vectors are normalized to 1 by their strongest dimension, therefore
       * noisy sounds are likely represented by values that are all close to 1,
       * while pure tones are described by one value at 1 (the pitch) and others
       * near 0. As can be seen below, the 12 vector indices are a combination
       * of low-power spectrum values at their respective pitch frequencies.
       */
      pitches: number[]

      /**
       * Timbre is the quality of a musical note or sound that distinguishes
       * different types of musical instruments, or voices. It is a complex
       * notion also referred to as sound color, texture, or tone quality, and
       * is derived from the shape of a segment’s spectro-temporal surface,
       * independently of pitch and loudness. The timbre feature is a vector
       * that includes 12 unbounded values roughly centered around 0. Those
       * values are high level abstractions of the spectral surface, ordered by
       * degree of importance.
       *
       * For completeness however, the first dimension represents the average
       * loudness of the segment; second emphasizes brightness; third is more
       * closely correlated to the flatness of a sound; fourth to sounds with a
       * stronger attack; etc. See an image below representing the 12 basis
       * functions (i.e. template segments).
       *
       * The actual timbre of the segment is best described as a linear
       * combination of these 12 basis functions weighted by the coefficient
       * values: timbre = c1 x b1
       *
       * - C2 x b2 + ... + c12 x b12, where c1 to c12 represent the 12
       *   coefficients and b1 to b12 the 12 basis functions as displayed below.
       *   Timbre vectors are best used in comparison with each other.
       */
      timbre: number[]
    })[]

    /**
     * A tatum represents the lowest regular pulse train that a listener
     * intuitively infers from the timing of perceived musical events
     * (segments).
     */
    tatums: SegmentPrediction[]
  }

  '/me/player': {}

  '/search': {
    tracks: {
      href: string
      items: Track
      limit: number
      next: string | null
      offset: number
      previous: string | null
      total: number
    }
    artists: {
      href: string
      items: Artist[]
      limit: number
      next: string | null
      offset: number
      previous: string | null
      total: number
    }
    albums: {
      href: string
      items: Album[]
      limit: number
      next: string | null
      offset: number
      previous: string | null
      total: number
    }
    playlists: {
      href: string
      items: Playlist[]
      limit: number
      next: string | null
      offset: number
      previous: string | null
      total: number
    }
    shows: {
      href: string
      items: Show[]
      limit: number
      next: string | null
      offset: number
      previous: string | null
      total: number
    }
    episodes: {
      href: string
      items: Episode[]
      limit: number
      next: string | null
      offset: number
      previous: string | null
      total: number
    }
    audiobooks: {
      href: string
      items: Audiobook[]
      limit: number
      next: string | null
      offset: number
      previous: string | null
      total: number
    }
  }

  '/me/tracks': {
    href: string
    items: { added_at: string; track: Track }[]
    limit: number
    next: string
    offset: number
    previous: string
    total: number
  }
}

export type Device = {
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  /** Int from 0-100 */
  volume_percent: number
}

type Playlist = {}

type Show = {}

type Episode = {}

type Audiobook = {}

type Artist = {
  external_urls: { spotify: string }
  href: string
  id: string
  name: string
  type: string
  uri: string
}

type Album = {
  album_type: string
  artists: Artist[]
  external_urls: { spotify: string }
  href: string
  id: string
  images: { height: number; url: string; width: number }[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}

export type Track = {
  album: Album
  artists: Artist[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: { isrc: string }
  external_urls: { spotify: string }
  href: string
  id: string
  is_local: boolean
  is_playable: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}
