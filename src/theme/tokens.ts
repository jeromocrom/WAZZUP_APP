export const tokens = {
  color: { primary:'#FFD300', black:'#000', white:'#FFF', gray50:'#F5F5F5', bgDark:'#0F0F0F', surfaceDark:'#161616', textDark:'#FFFFFF' },
  spacing:{ xs:6, s:8, m:12, l:16, xl:24, xxl:32 },
  radius:{ sm:12, md:16, lg:24, full:999 },
  shadow:{ soft:{elevation:2, shadowColor:'#000', shadowOpacity:0.08, shadowRadius:4, shadowOffset:{width:0,height:2}},
           card:{elevation:4, shadowColor:'#000', shadowOpacity:0.12, shadowRadius:8, shadowOffset:{width:0,height:6}} },
  z:{ header:20, chips:15, carousel:10 }
} as const;
