import React, { useMemo, useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput, Platform, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type WhenMode = 'any' | 'date' | 'range';
export type Filters = {
  priceMax: number | null;
  distanceKm: number | null; // 0 => sans limite
  when: WhenMode;
  date?: string | null;       // YYYY-MM-DD for 'date'
  startDate?: string | null;  // YYYY-MM-DD for 'range'
  endDate?: string | null;    // YYYY-MM-DD for 'range'
};

type Props = {
  visible: boolean;
  value: Filters;
  onChange: (v: Filters) => void;
  onClose: () => void;
  onApply: () => void;
};

function isoOnly(d: Date){
  const y = d.getFullYear();
  const m = (`0${d.getMonth()+1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${y}-${m}-${day}`;
}

function pretty(d?: string | null){
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00');
  try { return dt.toLocaleDateString(); } catch { return d; }
}

export default function FilterSheet({ visible, value, onChange, onClose, onApply }: Props){
  const insets = useSafeAreaInsets();
  const [showDate1, setShowDate1] = useState(false);
  const [showDate2, setShowDate2] = useState(false);

  function set<K extends keyof Filters>(k: K, v: Filters[K]){
    onChange({ ...value, [k]: v });
  }

  function onPick(which: 'date' | 'start' | 'end', e: DateTimePickerEvent, d?: Date){
    if (e.type === 'dismissed') { setShowDate1(false); setShowDate2(false); return; }
    const iso = isoOnly(d || new Date());
    if (which === 'date') set('date', iso);
    if (which === 'start') set('startDate', iso);
    if (which === 'end') set('endDate', iso);
    setShowDate1(false); setShowDate2(false);
  }

  function reset(){
    onChange({ priceMax: null, distanceKm: null, when: 'any', date: null, startDate: null, endDate: null });
  }

  const modes: { key: WhenMode; label: string }[] = [
    { key: 'any', label: "N’importe quand" },
    { key: 'date', label: 'Date précise' },
    { key: 'range', label: 'Période' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Filtres</Text>
            <Pressable onPress={onClose} style={styles.close}><Text style={{ fontWeight:'900' }}>✕</Text></Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 12 }} keyboardShouldPersistTaps="handled">
            {/* Budget */}
            <Text style={styles.section}>Budget (max)</Text>
            <View style={styles.rowInput}>
              <TextInput
                value={value.priceMax === null ? '' : String(value.priceMax)}
                onChangeText={(t)=> {
                  const n = parseInt(t.replace(/[^0-9]/g,''), 10);
                  set('priceMax', Number.isFinite(n) ? n : null);
                }}
                keyboardType="numeric"
                placeholder="Ex: 30"
                style={styles.input}
              />
              <Text style={styles.suffix}>€</Text>
              <Pressable onPress={()=> set('priceMax', null)} style={styles.clearBtn}><Text>Effacer</Text></Pressable>
            </View>

            {/* Distance */}
            <Text style={[styles.section, { marginTop: 16 }]}>Distance</Text>
            <View style={{ paddingHorizontal: 6 }}>
              <Slider
                value={value.distanceKm ?? 0}
                onValueChange={(v)=> set('distanceKm', Math.round(v))}
                minimumValue={0}
                maximumValue={100}
                step={5}
                minimumTrackTintColor="#000"
                maximumTrackTintColor="#999"
                thumbTintColor="#FFD300"
              />
              <Text style={{ fontWeight:'800', textAlign:'right' }}>
                {value.distanceKm && value.distanceKm > 0 ? `${value.distanceKm} km` : 'Sans limite'}
              </Text>
            </View>

            {/* Quand */}
            <Text style={[styles.section, { marginTop: 16 }]}>Quand</Text>
            <View style={styles.segmentWrap} accessibilityRole="tablist">
              {modes.map((m, idx) => {
                const active = value.when === m.key;
                return (
                  <Pressable
                    key={m.key}
                    onPress={()=> set('when', m.key)}
                    style={[
                      styles.seg,
                      idx === 0 && styles.segFirst,
                      idx === modes.length-1 && styles.segLast,
                      active && styles.segActive
                    ]}
                    accessibilityState={{ selected: active }}
                    hitSlop={{ top:8, bottom:8, left:8, right:8 }}
                  >
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={[styles.segLabel, active && styles.segLabelActive]}
                    >
                      {m.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {value.when==='date' && (
              <View style={{ marginTop: 8 }}>
                <Pressable onPress={()=> setShowDate1(true)} style={styles.dateBtn}>
                  <Text style={styles.dateBtnTxt}>{value.date ? pretty(value.date) : 'Choisir une date'}</Text>
                </Pressable>
                {showDate1 && (
                  <DateTimePicker
                    value={value.date ? new Date(value.date+'T00:00:00') : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                    onChange={(e, d)=> onPick('date', e as any, d as Date)}
                  />
                )}
              </View>
            )}

            {value.when==='range' && (
              <View style={{ marginTop: 8, gap: 8 }}>
                <Pressable onPress={()=> setShowDate1(true)} style={styles.dateBtn}>
                  <Text style={styles.dateBtnTxt}>{value.startDate ? `Du ${pretty(value.startDate)}` : 'Date de début'}</Text>
                </Pressable>
                <Pressable onPress={()=> setShowDate2(true)} style={styles.dateBtn}>
                  <Text style={styles.dateBtnTxt}>{value.endDate ? `Au ${pretty(value.endDate)}` : 'Date de fin'}</Text>
                </Pressable>
                {showDate1 && (
                  <DateTimePicker
                    value={value.startDate ? new Date(value.startDate+'T00:00:00') : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                    onChange={(e, d)=> onPick('start', e as any, d as Date)}
                  />
                )}
                {showDate2 && (
                  <DateTimePicker
                    value={value.endDate ? new Date(value.endDate+'T00:00:00') : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                    onChange={(e, d)=> onPick('end', e as any, d as Date)}
                  />
                )}
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable onPress={reset} style={[styles.btn, styles.btnGhost]}><Text style={styles.btnGhostTxt}>Réinitialiser</Text></Pressable>
            <Pressable onPress={onApply} style={[styles.btn, styles.btnPrimary]}><Text style={styles.btnPrimaryTxt}>Appliquer</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const SEG_H = 44;

const styles = StyleSheet.create({
  backdrop:{ flex:1, backgroundColor:'#00000066', justifyContent:'flex-end' },
  sheet:{ backgroundColor:'#FFF', borderTopLeftRadius:20, borderTopRightRadius:20, borderWidth:2, borderColor:'#000', padding:12 },
  handle:{ alignSelf:'center', width:56, height:6, borderRadius:999, backgroundColor:'#000', marginBottom:12 },
  header:{ flexDirection:'row', alignItems:'center' },
  title:{ fontWeight:'900', fontSize:18, flex:1 },
  close:{ width:36, height:36, borderRadius:12, borderWidth:1, borderColor:'#000', alignItems:'center', justifyContent:'center', backgroundColor:'#FFF' },

  section:{ fontWeight:'900', fontSize:16, marginTop:4 },
  rowInput:{ flexDirection:'row', alignItems:'center', gap:8, marginTop:8 },
  input:{ flex:1, height:44, borderRadius:12, borderWidth:1, borderColor:'#000', paddingHorizontal:12, backgroundColor:'#FFF', fontWeight:'700' },
  suffix:{ fontWeight:'900' },
  clearBtn:{ paddingHorizontal:10, paddingVertical:8, borderRadius:10, borderWidth:1, borderColor:'#000', backgroundColor:'#FFF' },

  /* Segmented control */
  segmentWrap:{
    flexDirection:'row',
    alignItems:'stretch',
    marginTop:8,
    borderWidth:1,
    borderColor:'#000',
    borderRadius:999,
    overflow:'hidden', // clé pour éviter les débords visuels
    backgroundColor:'#FFF',
  },
  seg:{
    flex:1,
    height: SEG_H,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FFF',
    borderRightWidth:1,
    borderRightColor:'#000',
  },
  segFirst:{ borderTopLeftRadius:999, borderBottomLeftRadius:999 },
  segLast:{ borderTopRightRadius:999, borderBottomRightRadius:999, borderRightWidth:0 },
  segActive:{
    backgroundColor:'#FFD300',
  },
  segLabel:{
    fontWeight:'900',
    paddingHorizontal:10,
    textAlign:'center',
    // Pour Android: centrer verticalement et éviter les débords de glyphes
    textAlignVertical:'center' as any,
    includeFontPadding:false as any,
    // Assure un rendu homogène même pour “N’importe quand”
    lineHeight:18,
  },
  segLabelActive:{},
  /* --- */

  dateBtn:{ height:44, borderRadius:12, borderWidth:1, borderColor:'#000', backgroundColor:'#FFF', alignItems:'center', justifyContent:'center' },
  dateBtnTxt:{ fontWeight:'800' },

  footer:{ flexDirection:'row', gap:8, marginTop:8 },
  btn:{ flex:1, height:48, borderRadius:14, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#000' },
  btnGhost:{ backgroundColor:'#FFF' },
  btnGhostTxt:{ fontWeight:'900' },
  btnPrimary:{ backgroundColor:'#FFD300' },
  btnPrimaryTxt:{ fontWeight:'900' },
});
